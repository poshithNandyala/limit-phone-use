#!/usr/bin/env python3
"""
Digital Wellbeing Backend API Testing
Tests all backend endpoints for the Digital Wellbeing app
"""

import requests
import json
import time
import sys
from typing import Dict, Any

# Use the backend URL from frontend configuration
BASE_URL = "https://hello-world-6840.preview.emergentagent.com/api"

class DigitalWellbeingTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.test_results = []
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    
    def log_test(self, test_name: str, success: bool, details: str, response_time: float = 0):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            'test': test_name,
            'status': status,
            'success': success,
            'details': details,
            'response_time': response_time
        }
        self.test_results.append(result)
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_time > 0:
            print(f"   Response time: {response_time:.2f}s")
        print()
    
    def test_health_check(self):
        """Test GET / - Health check endpoint"""
        try:
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                expected_message = "Digital Wellbeing API"
                expected_status = "active"
                
                if (data.get("message") == expected_message and 
                    data.get("status") == expected_status):
                    self.log_test(
                        "Health Check", 
                        True, 
                        f"Correct response: {data}",
                        response_time
                    )
                else:
                    self.log_test(
                        "Health Check", 
                        False, 
                        f"Unexpected response format: {data}"
                    )
            else:
                self.log_test(
                    "Health Check", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_test("Health Check", False, f"Request failed: {str(e)}")
    
    def test_predefined_reason(self):
        """Test POST /reason with predefined reason_type"""
        try:
            start_time = time.time()
            payload = {"reason_type": "predefined"}
            response = self.session.post(
                f"{self.base_url}/reason", 
                json=payload
            )
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                reason = data.get("reason", "")
                reason_type = data.get("type", "")
                
                if reason and isinstance(reason, str) and len(reason.strip()) > 0:
                    if reason_type == "predefined":
                        self.log_test(
                            "Predefined Reason", 
                            True, 
                            f"Valid reason received: '{reason[:50]}...' (type: {reason_type})",
                            response_time
                        )
                    else:
                        self.log_test(
                            "Predefined Reason", 
                            False, 
                            f"Wrong type returned: {reason_type}, expected 'predefined'"
                        )
                else:
                    self.log_test(
                        "Predefined Reason", 
                        False, 
                        f"Empty or invalid reason: {data}"
                    )
            else:
                self.log_test(
                    "Predefined Reason", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_test("Predefined Reason", False, f"Request failed: {str(e)}")
    
    def test_ai_reason(self):
        """Test POST /reason with ai reason_type"""
        try:
            start_time = time.time()
            payload = {"reason_type": "ai"}
            response = self.session.post(
                f"{self.base_url}/reason", 
                json=payload,
                timeout=30  # AI requests might take longer
            )
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                reason = data.get("reason", "")
                reason_type = data.get("type", "")
                
                if reason and isinstance(reason, str) and len(reason.strip()) > 0:
                    if reason_type == "ai":
                        self.log_test(
                            "AI Reason", 
                            True, 
                            f"AI reason received: '{reason}' (type: {reason_type}, time: {response_time:.2f}s)",
                            response_time
                        )
                    else:
                        # Could be fallback to predefined
                        self.log_test(
                            "AI Reason", 
                            True, 
                            f"Fallback to predefined reason: '{reason[:50]}...' (type: {reason_type})",
                            response_time
                        )
                else:
                    self.log_test(
                        "AI Reason", 
                        False, 
                        f"Empty or invalid reason: {data}"
                    )
            else:
                self.log_test(
                    "AI Reason", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_test("AI Reason", False, f"Request failed: {str(e)}")
    
    def test_invalid_reason_type(self):
        """Test POST /reason with invalid reason_type"""
        try:
            start_time = time.time()
            payload = {"reason_type": "invalid"}
            response = self.session.post(
                f"{self.base_url}/reason", 
                json=payload
            )
            response_time = time.time() - start_time
            
            if response.status_code == 400:
                self.log_test(
                    "Invalid Reason Type", 
                    True, 
                    f"Correctly returned 400 error for invalid reason_type",
                    response_time
                )
            elif response.status_code == 200:
                # Check if it fallback to predefined
                data = response.json()
                if data.get("type") == "predefined":
                    self.log_test(
                        "Invalid Reason Type", 
                        True, 
                        f"Fallback to predefined reason: '{data.get('reason', '')[:50]}...'",
                        response_time
                    )
                else:
                    self.log_test(
                        "Invalid Reason Type", 
                        False, 
                        f"Unexpected response: {data}"
                    )
            else:
                self.log_test(
                    "Invalid Reason Type", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_test("Invalid Reason Type", False, f"Request failed: {str(e)}")
    
    def test_all_reasons(self):
        """Test GET /reasons/all - Get all pre-defined reasons"""
        try:
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/reasons/all")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    if len(data) == 30:
                        # Check if all elements are non-empty strings
                        all_valid = all(isinstance(reason, str) and len(reason.strip()) > 0 for reason in data)
                        if all_valid:
                            self.log_test(
                                "All Reasons", 
                                True, 
                                f"Received {len(data)} valid reasons",
                                response_time
                            )
                        else:
                            empty_count = sum(1 for r in data if not isinstance(r, str) or len(r.strip()) == 0)
                            self.log_test(
                                "All Reasons", 
                                False, 
                                f"Found {empty_count} empty/invalid reasons out of {len(data)}"
                            )
                    else:
                        self.log_test(
                            "All Reasons", 
                            False, 
                            f"Expected 30 reasons, got {len(data)}"
                        )
                else:
                    self.log_test(
                        "All Reasons", 
                        False, 
                        f"Expected array, got: {type(data)}"
                    )
            else:
                self.log_test(
                    "All Reasons", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_test("All Reasons", False, f"Request failed: {str(e)}")
    
    def test_stats_update(self):
        """Test POST /stats - Update statistics"""
        try:
            start_time = time.time()
            payload = {
                "screen_time_minutes": 45,
                "notifications_sent": 5
            }
            response = self.session.post(
                f"{self.base_url}/stats", 
                json=payload
            )
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                expected_status = "success"
                expected_message = "Stats updated"
                
                if (data.get("status") == expected_status and 
                    data.get("message") == expected_message):
                    self.log_test(
                        "Stats Update", 
                        True, 
                        f"Stats updated successfully: {data}",
                        response_time
                    )
                else:
                    self.log_test(
                        "Stats Update", 
                        False, 
                        f"Unexpected response format: {data}"
                    )
            else:
                self.log_test(
                    "Stats Update", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_test("Stats Update", False, f"Request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 60)
        print("DIGITAL WELLBEING BACKEND API TESTING")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        print()
        
        # Run all tests
        self.test_health_check()
        self.test_predefined_reason()
        self.test_ai_reason()
        self.test_invalid_reason_type()
        self.test_all_reasons()
        self.test_stats_update()
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print()
        
        if total - passed > 0:
            print("FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"❌ {result['test']}: {result['details']}")
            print()
        
        print("DETAILED RESULTS:")
        for result in self.test_results:
            print(f"{result['status']} {result['test']}")
            if result['details']:
                print(f"   {result['details']}")
        
        return passed == total

if __name__ == "__main__":
    tester = DigitalWellbeingTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)