import html
import re
from typing import List, Optional

JUNK_TITLE_PATTERNS = [
    r"^\s*404\s*$",
    r"^\s*test\s+job\s*$",
    r"^\s*title\s+tbd\s*$",
    r"^\s*looking\s+for\s+job\s*$",
    r"^\s*current\s+openings\s*$",
    r"^\s*all\s+other\s+future\s+considerations\s*$",
    r"^\s*express\s+your\s+interest\s*$",
    r"^\s*vacatures?\s*$",
    r"^\s*untitled\s*$",
    r"^\s*dummy\s*$",
]

BLOATED_TAG_BLACKLIST = {
    "sales", "engineer", "technical", "ecommerce", "teaching", "admin",
    "education", "infosec", "design", "hr", "sys admin", "customer support",
    "testing", "travel", "exec", "ops", "medical", "full time", "digital nomad", "supervisor"
}

def clean_text(text: Optional[str]) -> str:
    """Clean text from HTML entities and UTF-8 mojibake decoding errors."""
    if not text:
        return ""
    
    # 1. Unescape HTML entities (&amp; -> &, &quot; -> ", etc.)
    cleaned = html.unescape(text)
    
    # 2. Fix UTF-8 / Latin-1 Mojibake encoding glitches (e.g. JaboatÃ£o -> Jaboatão)
    try:
        if any(bad in cleaned for bad in ["Ã", "Â", "â", "é£", "Ø±"]):
            cleaned = cleaned.encode("latin1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        pass

    # 3. Strip raw HTML tags if any exist
    cleaned = re.sub(r'<[^>]+>', '', cleaned)
    
    # 4. Collapse extra spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def clean_location(loc: Optional[str]) -> str:
    """Clean location strings (e.g., 'Toronto,' -> 'Toronto', 'Port of Spain, ' -> 'Port of Spain')."""
    if not loc:
        return "Remote"
    
    cleaned = clean_text(loc)
    # Strip trailing or leading commas/dashes/dots/spaces
    cleaned = re.sub(r'^[\s,.\-]+|[\s,.\-]+$', '', cleaned)
    
    if not cleaned or cleaned.lower() in ["", "none", "null", "undefined"]:
        return "Remote"
    return cleaned

def clean_tags(tags: List[str], title: str = "") -> List[str]:
    """Sanitize and clean tag list. Removes bloated copy-pasted tag dumps."""
    if not tags:
        return []

    cleaned_list = []
    seen = set()

    for tag in tags:
        if not tag or not isinstance(tag, str):
            continue
        c_tag = clean_text(tag).lower()
        if c_tag and c_tag not in seen and len(c_tag) < 30:
            seen.add(c_tag)
            cleaned_list.append(c_tag)

    # Check for copy-pasted generic tag dump (e.g., Bell Person having 20+ generic tags)
    if len(cleaned_list) > 10:
        common_bloated = [t for t in cleaned_list if t in BLOATED_TAG_BLACKLIST]
        if len(common_bloated) >= 6:
            # Keep only tags that match keywords in the job title or specific technical terms
            title_words = set(re.findall(r'\w+', title.lower()))
            cleaned_list = [t for t in cleaned_list if t in title_words or t not in BLOATED_TAG_BLACKLIST]

    return cleaned_list[:6]

def is_valid_job(title: str, company: str) -> bool:
    """Validate whether a job listing is authentic or a junk placeholder."""
    c_title = clean_text(title)
    c_company = clean_text(company)

    if not c_title or len(c_title) < 3:
        return False

    for pattern in JUNK_TITLE_PATTERNS:
        if re.search(pattern, c_title, re.IGNORECASE):
            return False

    if c_company.lower() in ["test", "dummy", "404"]:
        return False

    return True
