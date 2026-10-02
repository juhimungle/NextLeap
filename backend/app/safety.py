import re
from typing import Tuple, Optional

# Pre-compiled regex patterns for PII detection
PAN_REGEX = re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]\b', re.IGNORECASE)
AADHAAR_REGEX = re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b')
PHONE_REGEX = re.compile(r'(?:\+?91[\-\s]?)?[6-9]\d{9}\b')
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
# OTP detection: catches 'otp is 123456', 'otp: 1234', '123456 is my otp', etc.
OTP_REGEX = re.compile(r'\b(?:otp|one[- ]time[- ]password)\b.*?\b\d{4,8}\b|\b\d{4,8}\b.*?\b(?:otp|one[- ]time[- ]password)\b', re.IGNORECASE)
CREDENTIAL_REGEX = re.compile(r'\b(?:password|passwd|pin\s*number|login\s*credentials|mpin|login)\b', re.IGNORECASE)

# Advice / Opinion / Portfolio keywords
ADVICE_KEYWORDS = [
    r'\bshould\s+i\s+(?:buy|sell|invest|choose|pick|switch|redeem|hold)\b',
    r'\bwhich\s+(?:fund|scheme)\s+is\s+(?:best|better|safest|top|good|worth)\b',
    r'\bwhich\s+is\s+(?:better|best|safest)\b',
    r'\bwhere\s+should\s+i\s+invest\b',
    r'\bcan\s+you\s+recommend\b',
    r'\brecommend\s+(?:me\s+)?(?:a\s+)?(?:fund|scheme|investment)\b',
    r'\bportfolio\s+(?:review|advice|recommendation|suggestion)\b',
    r'\bis\s+(?:it|this)\s+(?:good|safe|recommended)\s+to\s+invest\b',
    r'\bhow\s+to\s+become\s+rich\b',
    r'\bwill\s+it\s+give\s+high(?:er)?\s+returns\b',
    r'\bcompare\s+and\s+choose\b',
    r'\btell\s+me\s+where\s+to\s+put\s+my\s+money\b'
]
ADVICE_REGEX = re.compile('|'.join(ADVICE_KEYWORDS), re.IGNORECASE)

# Performance / Return comparison keywords
PERFORMANCE_KEYWORDS = [
    r'\b(?:how\s+much|what)\s+(?:return|returns|cagr|profit)\b',
    r'\bwhich\s+performed\s+better\b',
    r'\bperformance\s+comparison\b',
    r'\bcompare\s+(?:the\s+)?(?:returns|performance)\b',
    r'\bexpected\s+returns\b',
    r'\bannualized\s+returns\b',
    r'\bpredict(?:ed)?\s+returns\b'
]
PERFORMANCE_REGEX = re.compile('|'.join(PERFORMANCE_KEYWORDS), re.IGNORECASE)

def detect_pii(text: str) -> bool:
    """Detects whether text contains personal identifiable information (PII)."""
    if PAN_REGEX.search(text):
        return True
    if AADHAAR_REGEX.search(text):
        return True
    if PHONE_REGEX.search(text):
        return True
    if EMAIL_REGEX.search(text):
        return True
    if OTP_REGEX.search(text):
        return True
    if CREDENTIAL_REGEX.search(text):
        return True
    return False

def check_intent(text: str) -> Tuple[str, Optional[str]]:
    """
    Checks user intent:
    Returns: ("pii", reason) | ("advice", reason) | ("performance", reason) | ("factual", None)
    """
    if detect_pii(text):
        return ("pii", "Personal identifiable information detected.")
    
    if ADVICE_REGEX.search(text):
        return ("advice", "Investment advice or recommendation query detected.")
        
    if PERFORMANCE_REGEX.search(text):
        return ("performance", "Performance calculation or returns comparison query detected.")
        
    return ("factual", None)
