# Rich Text Editor Guide

## Overview
The product description field now supports rich text formatting, allowing you to create professional, well-formatted product descriptions with:
- **Bold text**
- *Italic text*
- Headings (H2, H3)
- Bullet point lists
- Numbered lists
- Block quotes
- Code blocks

## How to Use

### Toolbar Buttons

1. **Bold (B)** - Make selected text bold
2. **Italic (I)** - Make selected text italic
3. **Heading (H2)** - Convert line to a heading
4. **Bullet List** - Create an unordered list with bullet points
5. **Numbered List** - Create an ordered list with numbers
6. **Quote** - Create a blockquote for citations
7. **Code Block** - Add code snippets with syntax highlighting
8. **Undo/Redo** - Undo or redo your last action

### Formatting Tips

#### Creating Lists
1. Click the bullet or numbered list button
2. Type your list item
3. Press Enter to create a new list item
4. Press Enter twice to exit the list

#### Adding Headings
1. Select or place cursor on the line you want to make a heading
2. Click the H2 button
3. Click again to toggle back to normal text

#### Bold and Italic
1. Select the text you want to format
2. Click the Bold or Italic button
3. Or use keyboard shortcuts:
   - Bold: Ctrl+B (Windows) / Cmd+B (Mac)
   - Italic: Ctrl+I (Windows) / Cmd+I (Mac)

### Best Practices

1. **Use Headings** - Break up long descriptions with H2 headings for different sections
2. **Use Lists** - Make features or specifications easier to read with bullet points
3. **Keep it Clean** - Don't overuse formatting - use it to enhance readability
4. **Preview** - Always check how your description looks on the product page

### Example Structure

```
Product Overview

This is the main description of your product...

Key Features
• Feature 1
• Feature 2
• Feature 3

Specifications
1. Size: Large
2. Material: Cotton
3. Care: Machine washable

Perfect for special occasions and everyday wear!
```

## Technical Details

The editor uses Tiptap (built on ProseMirror) and saves content as HTML. All formatting is preserved and displayed correctly on the product detail page.
