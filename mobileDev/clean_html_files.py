#!/usr/bin/env python3
import os
import re

def clean_html_files():
    # Get list of HTML files
    html_files = [f for f in os.listdir('.') if f.startswith('preposition-') and f.endswith('.html')]
    print(f'Found {len(html_files)} HTML files to clean')

    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the script tag and everything after it until </body>
        # Replace with just the script tag and proper closing
        pattern = r'<script src="jsFiles/[^"]+"></script>.*?(?=</body>)'
        
        # Extract the script reference
        script_match = re.search(r'<script src="jsFiles/[^"]+"></script>', content)
        if script_match:
            script_tag = script_match.group(0)
            replacement = f'{script_tag}\n'
            
            # Replace everything from the script tag to before </body>
            updated_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            print(f'Cleaned {html_file}')

if __name__ == '__main__':
    clean_html_files()
