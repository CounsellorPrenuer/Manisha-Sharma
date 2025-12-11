# Design Guidelines for Marichi World Career Coaching Website

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern SaaS platforms with hyper-modern aesthetics featuring glassmorphism, bold gradients, and premium interactive experiences.

## Core Visual Identity

### Typography
- **Headings:** Bold, large-scale typography (48-72px for hero, 32-48px for sections)
- **Body Text:** Clean, readable sans-serif (16-18px)
- **Special Effect:** Gradient text overlays on all major headings
- **Hierarchy:** Clear distinction between H1 (hero statements), H2 (section titles), H3 (card titles)

### Layout System
**Spacing Units:** Tailwind units of 4, 8, 12, 16, 20, 24 for consistent rhythm
- **Section Padding:** py-20 to py-32 on desktop, py-12 on mobile
- **Card Spacing:** gap-8 for grids, p-6 to p-8 for card interiors
- **Container:** max-w-7xl for full sections, max-w-6xl for content-focused areas

### Color Palette

**Light Mode:**
- Background: Pure white (#FFFFFF)
- Cards: Soft gray (#F8FAFC)
- Text: Dark slate (#0F172A)
- Accents: Soft pastel gradients

**Dark Mode:**
- Background: Deep navy (#0F172A)
- Cards: Slate (#1E293B)
- Text: White with slight transparency
- Accents: Vibrant neon gradients

**Gradient Systems:**
- Primary: Purple (#8B5CF6) → Blue (#3B82F6) → Pink (#EC4899)
- Secondary: Cyan (#06B6D4) → Teal (#14B8A6)
- Accent: Orange (#F59E0B) → Red (#EF4444)

### Visual Effects

**Glassmorphism:**
- Frosted glass cards with backdrop blur
- Semi-transparent backgrounds with subtle borders
- Applied to navigation, cards, and floating elements

**Neumorphism:**
- Soft embossed effects on buttons and interactive elements
- Subtle shadows creating depth

**Special Effects:**
- Animated gradient mesh backgrounds
- Floating particle effects
- Neon glow effects on hover (dark mode)
- Holographic/iridescent card treatments
- Morphing blob shapes
- Wave animations

## Page Structure & Components

### Hero Section (Full Viewport)
- Full-screen animated gradient background with floating geometric shapes
- Large bold heading with gradient text effect
- Subheading describing coaching expertise
- Two prominent CTA buttons with blur backgrounds when placed over images
- Floating professional profile image with glow effect
- Animated scroll indicator at bottom

### About Me Section
- Professional photo with artistic frame/gradient border
- Compelling bio copy
- Animated career journey timeline
- Credentials display with icons
- Count-up statistics: years of experience, students helped, success rate
- 2-column layout on desktop

### Services Grid
- 3-column grid on desktop, 2 on tablet, 1 on mobile
- 3D flip card effects showing front/back
- Services: Career Guidance, Success Mindset Coaching, Career Transition, Interview Prep, Resume Building, College Selection
- Each card: Icon, title, description, "Learn More" button
- Gradient borders and lift effect on hover

### Testimonials Carousel
- Auto-playing slider with manual controls
- Cards with client photos, names, 5-star ratings
- Large animated quote marks
- Gradient borders on cards
- Smooth slide transitions

### Why Choose Me
- Grid of value propositions with icons
- Animated counters for statistics
- Achievement badges/awards display
- Success metrics visualization

### Blog/Articles Grid
- 3-column grid of blog cards
- Featured image, title, excerpt, date, category tags
- Color-coded category tags
- "Read More" buttons with hover effects
- Search and filter functionality

### Contact Section
- 2-column layout: Form + Contact Information
- Floating label inputs (Name, Email, Phone, Message, Service Interest)
- Contact details with icons: manisha@globalcoachforyou.com, 9833657889
- Social media links
- Animated submit button with loading state

### Footer
- Multi-column layout: Quick links, Services, Contact Info, Social Media
- Newsletter subscription with inline form
- Gradient border separator at top
- Copyright information

### Admin Dashboard
- Sidebar navigation with sections
- Statistics cards at top
- Tables for contact submissions, testimonials, blog posts
- CRUD interfaces matching main site aesthetic
- Same glassmorphism and gradient treatments

## Animation Strategy

**Scroll Animations:**
- Fade-in + slide-up for sections entering viewport
- Parallax scrolling on hero images
- Staggered animations for card grids

**Interactive Animations:**
- Hover lift + glow on cards
- Ripple effect + scale on buttons
- 3D card flip for services
- Count-up on statistics when visible

**Custom Cursor:**
- Animated custom cursor replacing default
- Particle trail following cursor movement
- Different states for hover over buttons/links/text
- Glowing cursor on interactive elements

**Background Effects:**
- Continuously shifting gradient animations
- Floating/morphing blob shapes
- Particle systems in dark mode

## Light/Dark Mode Toggle
- Moon/sun icon switch in header
- Smooth transition animations between themes
- localStorage persistence
- All gradients, shadows, and effects adapt to theme
- Neon accents in dark mode, soft pastels in light mode

## Images
**Hero Section:** Large professional portrait of Manisha Sharma with floating/glow effects, placed right side or center
**About Section:** Professional headshot with artistic treatment
**Testimonials:** Client photos in circular frames
**Blog Cards:** Featured images for each article
**Services:** Icon illustrations for each service type

## Responsive Behavior
- Mobile: Single column, stacked elements, simplified animations
- Tablet: 2-column grids, reduced particle effects
- Desktop: Full multi-column layouts, all interactive effects active
- Touch-friendly button sizes across all devices