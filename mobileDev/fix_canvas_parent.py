#!/usr/bin/env python3
import os
import re

def fix_canvas_parent():
    js_dir = 'jsFiles'
    if not os.path.exists(js_dir):
        print(f"Directory {js_dir} not found!")
        return
    
    # Get list of JavaScript files
    js_files = [f for f in os.listdir(js_dir) if f.startswith('sketch-') and f.endswith('.js')]
    print(f'Found {len(js_files)} JavaScript files to update')

    for js_file in js_files:
        file_path = os.path.join(js_dir, js_file)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace createCanvas() calls that don't already have .parent()
        # Look for createCanvas(...) but not createCanvas(...).parent(...)
        pattern = r'createCanvas\([^)]+\)(?!\s*\.parent)'
        
        def add_parent(match):
            return match.group(0) + ".parent('canvas')"
        
        updated_content = re.sub(pattern, add_parent, content)
        
        # Only write if there were changes
        if updated_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f'Updated {js_file}')
        else:
            print(f'No changes needed for {js_file}')

if __name__ == '__main__':
    fix_canvas_parent()
