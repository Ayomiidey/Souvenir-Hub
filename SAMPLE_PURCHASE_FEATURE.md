# Sample Purchase Feature

## Overview
Added a new feature that allows customers to choose between buying a sample (1 unit) or making a regular purchase (minimum 5 units).

## Features Implemented

### 1. Purchase Type Selection
- **Sample Purchase**: Fixed at 1 unit
  - Allows customers to test product quality before bulk ordering
  - Quantity controls are disabled (fixed at 1)
  - Clearly labeled with "Buy Sample"

- **Regular Purchase**: Minimum 5 units
  - Standard bulk purchase option
  - Minimum quantity enforced at 5 units
  - Maximum limited by available stock
  - Clearly labeled with "Buy Regular (Min. 5 units)"

### 2. User Interface
- Radio button selection with descriptive text
- Visual feedback showing selected option
- Disabled quantity controls for sample orders
- Badge indicator showing "Sample: 1 unit only" when sample is selected
- Responsive design with hover effects

### 3. Quantity Controls
- **Sample Mode**: 
  - Quantity locked at 1
  - Plus/Minus buttons disabled
  - Input field disabled
  
- **Regular Mode**:
  - Minimum quantity: 5 units
  - Maximum quantity: Available stock
  - Plus/Minus buttons work normally
  - Input field accepts manual entry (validated)

### 4. Integration
- WhatsApp order message includes purchase type
- Cart integration maintains purchase type
- Price calculation respects quantity

## User Experience

### Visual Elements
1. **Purchase Option Card**: Highlighted section with two radio options
2. **Descriptive Labels**: Clear explanation of each option
3. **Visual Feedback**: Hover states and selected state indicators
4. **Quantity Badge**: Shows "Sample: 1 unit only" when applicable

### Behavior
1. User selects purchase type (defaults to "Regular")
2. Quantity automatically adjusts:
   - Sample: Sets to 1 (locked)
   - Regular: Sets to 5 (minimum)
3. Quantity controls adapt based on selection
4. Add to cart respects the selected configuration

## Technical Details

### State Management
```typescript
const [purchaseType, setPurchaseType] = useState<"sample" | "regular">("regular");
```

### Quantity Logic
- Sample: `quantity = 1` (fixed)
- Regular: `quantity >= 5` (minimum enforced)

### Validation
- Prevents quantity below minimum for each type
- Respects stock availability
- Disables controls appropriately

## Benefits
1. **Risk Reduction**: Customers can test before bulk buying
2. **Quality Assurance**: Sample orders build confidence
3. **Bulk Optimization**: Regular orders maintain minimum viable quantities
4. **Clear Communication**: Users understand exactly what they're ordering
5. **Flexible Options**: Caters to different customer needs

## Future Enhancements
- Consider adding sample pricing (different from regular)
- Track sample-to-bulk conversion rates
- Add sample limit per customer
- Include sample shipping fee if applicable
