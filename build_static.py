import os
import shutil

def main():
    print("Building static site for GitHub Pages...")
    # Clean and create public directory
    if os.path.exists("public"):
        shutil.rmtree("public")
    os.makedirs("public")
    
    # Copy static files
    shutil.copytree("static", "public/static")
    
    # Read templates/index.html and replace Flask/Jinja syntax
    with open("templates/index.html", "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace url_for stylesheet & script links with direct relative paths
    content = content.replace("{{ url_for('static', filename='css/style.css') }}", "static/css/style.css")
    content = content.replace("{{ url_for('static', filename='js/app.js') }}", "static/js/app.js")
    
    # Write to public/index.html
    with open("public/index.html", "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Successfully built static site in public/ directory.")

if __name__ == "__main__":
    main()
