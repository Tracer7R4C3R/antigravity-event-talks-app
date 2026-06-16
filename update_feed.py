import os
import re
import json
import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"
OUTPUT_DIR = "static/data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "release-notes.json")

def fetch_and_parse_release_notes():
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    try:
        response = requests.get(FEED_URL, headers=headers, timeout=10)
        response.raise_for_status()
        xml_data = response.text
    except Exception as e:
        print(f"Error fetching feed: {e}")
        return []

    try:
        root = ET.fromstring(xml_data)
    except Exception as e:
        print(f"Error parsing XML: {e}")
        return []

    ns = {"atom": "http://www.w3.org/2005/Atom"}
    entries = []

    for idx, entry_elem in enumerate(root.findall("atom:entry", ns)):
        title_elem = entry_elem.find("atom:title", ns)
        updated_elem = entry_elem.find("atom:updated", ns)
        link_elem = entry_elem.find("atom:link", ns)
        content_elem = entry_elem.find("atom:content", ns)

        date_str = title_elem.text if title_elem is not None else ""
        updated_str = updated_elem.text if updated_elem is not None else ""
        link_url = link_elem.attrib.get("href") if link_elem is not None else ""
        html_content = content_elem.text if content_elem is not None else ""

        soup = BeautifulSoup(html_content, "html.parser")
        updates = []
        current_type = "Feature"
        current_content_nodes = []

        for child in soup.contents:
            if child.name == "h3":
                if current_content_nodes:
                    update_html = "".join(str(n) for n in current_content_nodes)
                    update_text = re.sub(
                        r"\s+",
                        " ",
                        "".join(
                            n.get_text() if hasattr(n, "get_text") else str(n)
                            for n in current_content_nodes
                        ),
                    ).strip()
                    updates.append(
                        {
                            "type": current_type,
                            "html": update_html,
                            "text": update_text,
                        }
                    )
                    current_content_nodes = []
                current_type = child.get_text().strip()
            elif child.name is not None or str(child).strip():
                current_content_nodes.append(child)

        if current_content_nodes:
            update_html = "".join(str(n) for n in current_content_nodes)
            update_text = re.sub(
                r"\s+",
                " ",
                "".join(
                    n.get_text() if hasattr(n, "get_text") else str(n)
                    for n in current_content_nodes
                ),
            ).strip()
            updates.append(
                {"type": current_type, "html": update_html, "text": update_text}
            )

        entries.append(
            {
                "id": idx,
                "date": date_str,
                "updated": updated_str,
                "link": link_url,
                "updates": updates,
            }
        )

    return entries

def main():
    print("Fetching and parsing release notes...")
    data = fetch_and_parse_release_notes()
    
    if not data:
        print("No data fetched. Aborting write.")
        return

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Save to file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully wrote parsed release notes to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
