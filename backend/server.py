from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import random
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class ReasonRequest(BaseModel):
    reason_type: str  # 'predefined' or 'ai'
    category: Optional[str] = None

class ReasonResponse(BaseModel):
    reason: str
    type: str
    category: Optional[str] = None

class StatsUpdate(BaseModel):
    screen_time_minutes: int
    notifications_sent: int

# Pre-defined reasons - diverse, impactful, organized by category.
# NOTE: the mobile app also bundles this same content locally (see
# frontend/constants/quotes.ts) so reminders keep working with no backend at
# all. This API only matters for the optional AI-generated reminder feature
# and for clients that want server-curated quotes.
REASONS_BY_CATEGORY = {
    "health": [
        "Your eyes need a break. Look at something 20 feet away for 20 seconds.",
        "Your posture is suffering. Stand up and stretch.",
        "Your neck and shoulders will thank you for the break.",
        "Physical activity boosts mood better than scrolling.",
        "Drink a glass of water. Your body is asking for attention.",
        "A five-minute walk can reset your entire nervous system.",
    ],
    "relationships": [
        "Someone you love might need you right now. Be present.",
        "Face-to-face conversations build deeper connections.",
        "Your relationships need quality time, not screen time.",
        "Call someone you miss instead of scrolling past their photo.",
        "Real connection happens in eye contact, not comment sections.",
    ],
    "productivity": [
        "Your productivity increases with focused, uninterrupted time.",
        "Your goals need action, not distraction.",
        "Every notification you ignore is a decision to protect your day.",
        "Small consistent effort now beats a scramble later.",
    ],
    "mindfulness": [
        "Mindfulness requires disconnection.",
        "Your attention is valuable. Don't give it away freely.",
        "Boredom is where your best ideas are hiding. Let it happen.",
        "The present moment is the only one you actually own.",
    ],
    "sleep": [
        "Sleep quality improves when screens are off before bed.",
        "Your brain needs downtime to process and restore.",
        "Blue light tricks your brain into thinking it's still daytime.",
    ],
    "nature": [
        "Nature is calling. Go outside and breathe.",
        "Sunset won't wait. Go watch it.",
        "Fresh air clears more mental fog than any app can.",
    ],
    "family": [
        "Your family misses you, even when you're in the same room.",
        "Children learn from watching you. Set a good example.",
        "Family dinners are better without phones on the table.",
    ],
    "focus": [
        "Your concentration span is getting shorter. Reclaim it.",
        "Single-tasking is a superpower now. Practice it.",
        "Turn the phone face down and watch your focus return.",
    ],
    "creativity": [
        "Your creativity thrives in boredom. Let your mind wander.",
        "Ideas rarely appear mid-scroll. Give your mind some empty space.",
    ],
    "growth": [
        "Your future self will thank you for this break.",
        "Books offer depth that social media can't match.",
        "Comparison on social media steals your joy.",
        "Real experiences > digital experiences.",
        "Digital detox isn't punishment, it's self-care.",
        "Morning routines without screens set a better tone for the day.",
        "Hobbies outside screens bring real satisfaction.",
        "Memories are made in moments, not on screens.",
    ],
}

PREDEFINED_REASONS = [r for reasons in REASONS_BY_CATEGORY.values() for r in reasons]

def _category_for(reason: str) -> Optional[str]:
    for category, reasons in REASONS_BY_CATEGORY.items():
        if reason in reasons:
            return category
    return None

# Initialize reasons collection
async def init_reasons():
    """Initialize pre-defined reasons in database if not present"""
    count = await db.reasons.count_documents({})
    if count == 0:
        reasons_docs = [
            {"reason": r, "type": "predefined", "category": category}
            for category, reasons in REASONS_BY_CATEGORY.items()
            for r in reasons
        ]
        await db.reasons.insert_many(reasons_docs)
        logger.info(f"Initialized {len(reasons_docs)} pre-defined reasons")

@app.on_event("startup")
async def startup_event():
    await init_reasons()

@api_router.get("/")
async def root():
    return {"message": "Digital Wellbeing API", "status": "active"}

@api_router.post("/reason", response_model=ReasonResponse)
async def get_reason(request: ReasonRequest):
    """Get a reason to close phone - either pre-defined or AI-generated"""
    try:
        if request.reason_type == "predefined":
            # Get random pre-defined reason from database, optionally scoped to a category
            match = {"type": "predefined"}
            if request.category and request.category in REASONS_BY_CATEGORY:
                match["category"] = request.category

            pipeline = [{"$match": match}, {"$sample": {"size": 1}}]
            cursor = db.reasons.aggregate(pipeline)
            result = await cursor.to_list(length=1)

            if result:
                return ReasonResponse(
                    reason=result[0]["reason"],
                    type="predefined",
                    category=result[0].get("category")
                )
            else:
                # Fallback to hardcoded if DB is empty or category has no matches
                pool = REASONS_BY_CATEGORY.get(request.category, PREDEFINED_REASONS)
                reason = random.choice(pool or PREDEFINED_REASONS)
                return ReasonResponse(
                    reason=reason,
                    type="predefined",
                    category=_category_for(reason)
                )

        elif request.reason_type == "ai":
            # Generate AI reason using Emergent LLM
            api_key = os.environ.get('EMERGENT_LLM_KEY')
            if not api_key:
                raise HTTPException(status_code=500, detail="LLM API key not configured")
            
            chat = LlmChat(
                api_key=api_key,
                session_id="screen-time-reduction",
                system_message="You are a compassionate digital wellbeing coach. Generate one compelling, personalized reason (max 15 words) for someone to close their phone and engage with real life. Be creative, caring, and varied in your approach - focus on health, relationships, productivity, nature, or mindfulness."
            ).with_model("openai", "gpt-5.2")
            
            user_message = UserMessage(
                text="Generate one unique, powerful reason to put the phone down right now."
            )
            
            ai_reason = await chat.send_message(user_message)
            
            return ReasonResponse(
                reason=ai_reason.strip(),
                type="ai"
            )
        
        else:
            raise HTTPException(status_code=400, detail="Invalid reason_type. Use 'predefined' or 'ai'")
    
    except Exception as e:
        logger.error(f"Error getting reason: {str(e)}")
        # Fallback to predefined reason on error
        return ReasonResponse(
            reason=random.choice(PREDEFINED_REASONS),
            type="predefined"
        )

@api_router.get("/reasons/all", response_model=List[str])
async def get_all_reasons():
    """Get all pre-defined reasons"""
    try:
        reasons = await db.reasons.find({"type": "predefined"}).to_list(length=200)
        return [r["reason"] for r in reasons]
    except Exception as e:
        logger.error(f"Error fetching reasons: {str(e)}")
        return PREDEFINED_REASONS

@api_router.get("/reasons/categories")
async def get_categories():
    """List available quote categories and how many quotes each has"""
    return {
        category: len(reasons)
        for category, reasons in REASONS_BY_CATEGORY.items()
    }

@api_router.post("/stats")
async def update_stats(stats: StatsUpdate):
    """Update user statistics"""
    try:
        # Store daily stats
        from datetime import datetime
        today = datetime.utcnow().strftime("%Y-%m-%d")
        
        await db.stats.update_one(
            {"date": today},
            {
                "$set": {
                    "screen_time_minutes": stats.screen_time_minutes,
                    "notifications_sent": stats.notifications_sent,
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        return {"status": "success", "message": "Stats updated"}
    except Exception as e:
        logger.error(f"Error updating stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
