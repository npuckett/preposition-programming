#!/usr/bin/env python3
import os
import re

# Function to replace embedded script with external script reference
def update_html_file(filename, js_filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the script section (more comprehensive pattern)
    # This pattern looks for <script> and everything until </script> or </body>
    script_pattern = r'<script>.*?(?=</body>)'
    replacement = f'<script src="jsFiles/{js_filename}"></script>\n'
    
    updated_content = re.sub(script_pattern, replacement, content, flags=re.DOTALL)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f'Updated {filename}')

def main():
    # Get list of HTML files
    html_files = [f for f in os.listdir('.') if f.startswith('preposition-') and f.endswith('.html')]
    print(f'Found {len(html_files)} HTML files to update')

    # Process each file
    for html_file in html_files:
        js_file = html_file.replace('preposition-', 'sketch-').replace('.html', '.js')
        print(f'Processing {html_file} -> {js_file}')
        update_html_file(html_file, js_file)
    
    print('All HTML files updated successfully!')

if __name__ == '__main__':
    main()
