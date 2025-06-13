#!/usr/bin/env python3
import os
import re

def fix_canvas_placement():
    # Get list of JavaScript files
    js_files = [f for f in os.listdir('jsFiles') if f.startswith('sketch-') and f.endswith('.js')]
    print(f'Found {len(js_files)} JavaScript files to fix')

    for js_file in js_files:
        filepath = os.path.join('jsFiles', js_file)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace createCanvas() calls to include .parent('canvas')
        # Handle various possible formats
        patterns = [
            (r'createCanvas\((\d+),\s*(\d+)\);', r"createCanvas(\1, \2).parent('canvas');"),
            (r'createCanvas\((\d+),\s*(\d+)\)(?!\.parent)', r"createCanvas(\1, \2).parent('canvas')"),
        ]
        
        updated_content = content
        changes_made = False
        
        for pattern, replacement in patterns:
            new_content = re.sub(pattern, replacement, updated_content)
            if new_content != updated_content:
                updated_content = new_content
                changes_made = True
        
        if changes_made:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f'Fixed canvas placement in {js_file}')
        else:
            print(f'No changes needed in {js_file}')

if __name__ == '__main__':
    fix_canvas_placement()
