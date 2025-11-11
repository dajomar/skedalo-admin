# BottomSheetModal Component

A reusable modal component that displays as a bottom sheet on mobile devices and a centered modal on desktop.

## Features

- 📱 **Mobile Bottom Sheet**: Slides up from the bottom on mobile devices
- 💻 **Desktop Modal**: Centered modal on larger screens
- 👆 **Swipe to Dismiss**: Swipe down to close on mobile (configurable)
- 🎨 **Customizable**: Icon, colors, size, and content
- ♿ **Accessible**: Proper ARIA labels and keyboard support
- 🎭 **Smooth Animations**: Native slide-up animation on mobile

## Usage

```tsx
import BottomSheetModal from '@/components/UI/BottomSheetModal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Edit Branch"
      subtitle="ID: #123"
      icon="store"
      maxWidth="3xl"
      footer={
        <div className="flex gap-3 p-6">
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button type="submit" form="my-form">Save</button>
        </div>
      }
    >
      <form id="my-form" onSubmit={handleSubmit}>
        {/* Your form content */}
      </form>
    </BottomSheetModal>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | **Required**. Controls modal visibility |
| `onClose` | `() => void` | - | **Required**. Callback when modal closes |
| `title` | `string` | - | **Required**. Modal title |
| `subtitle` | `string` | `undefined` | Optional subtitle below title |
| `icon` | `string` | `undefined` | Material Symbols icon name |
| `iconBgColor` | `string` | `'bg-primary/10'` | Background color for icon container |
| `iconColor` | `string` | `'text-primary'` | Icon text color |
| `children` | `ReactNode` | - | **Required**. Modal content |
| `footer` | `ReactNode` | `undefined` | Optional footer content |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'` | `'3xl'` | Maximum width on desktop |
| `showDragIndicator` | `boolean` | `true` | Show drag indicator on mobile |
| `enableSwipeDown` | `boolean` | `true` | Enable swipe down to close |

## Examples

### Simple Modal

```tsx
<BottomSheetModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirmation"
  icon="check_circle"
>
  <p>Are you sure you want to continue?</p>
</BottomSheetModal>
```

### Form Modal with Footer

```tsx
<BottomSheetModal
  isOpen={showForm}
  onClose={handleClose}
  title="Add New Item"
  subtitle="Fill in the details below"
  icon="add"
  maxWidth="2xl"
  footer={
    <div className="flex justify-end gap-3 p-6">
      <button 
        onClick={handleClose}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        Cancel
      </button>
      <button 
        type="submit"
        form="item-form"
        className="px-4 py-2 bg-primary text-white rounded-lg"
      >
        Save
      </button>
    </div>
  }
>
  <form id="item-form" onSubmit={handleSubmit}>
    {/* Form fields */}
  </form>
</BottomSheetModal>
```

### Custom Icon Colors

```tsx
<BottomSheetModal
  isOpen={showWarning}
  onClose={() => setShowWarning(false)}
  title="Warning"
  icon="warning"
  iconBgColor="bg-yellow-100"
  iconColor="text-yellow-600"
>
  <p>This action cannot be undone.</p>
</BottomSheetModal>
```

### Large Content with Scroll

```tsx
<BottomSheetModal
  isOpen={showDetails}
  onClose={() => setShowDetails(false)}
  title="Item Details"
  icon="info"
  maxWidth="4xl"
>
  <div className="space-y-4">
    {/* Long content that will scroll */}
  </div>
</BottomSheetModal>
```

### Without Swipe Dismiss

```tsx
<BottomSheetModal
  isOpen={showCritical}
  onClose={() => setShowCritical(false)}
  title="Important Action"
  icon="priority_high"
  enableSwipeDown={false}
  showDragIndicator={false}
>
  <p>This requires explicit confirmation.</p>
</BottomSheetModal>
```

## Styling

The component uses Tailwind CSS classes. You can customize:

- **Footer styling**: Pass your own styled footer via the `footer` prop
- **Content spacing**: Add padding/margins in your `children` content
- **Icon appearance**: Use `iconBgColor` and `iconColor` props

## Mobile Behavior

On mobile devices (< 640px):
- Slides up from bottom with animation
- Occupies 85% of viewport height
- Shows drag indicator at top
- Supports swipe down to close (if enabled)
- Rounded top corners only

## Desktop Behavior

On desktop devices (≥ 640px):
- Centered modal
- Maximum height of 90vh
- Rounded corners on all sides
- No drag indicator
- No swipe gestures

## Notes

- The modal content area is scrollable if content exceeds available space
- Header and footer (if provided) remain fixed while content scrolls
- Backdrop click closes the modal
- ESC key support can be added if needed
- Works with forms using the `form` attribute on submit buttons
