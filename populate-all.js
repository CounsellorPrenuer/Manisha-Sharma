import { createClient } from "@sanity/client";

const client = createClient({
    projectId: "2saavkiq",
    dataset: "production",
    useCdn: false,
    token: "skbYQRN3iBjvFexIM1kXgxiMKuhfs516ooCbcsag7gYXO3XFv0V3BwusQkmmDCKmC2sXbJQsN9qsEiyH0EVbvgN3Ixom1GxheJgaCVYuhPM0fnBby0U9UhNkqyqGSm0aHJyLsTIxJsVAPXTuPYqHS2UtBw5gYO49ViCqqFZm1WT30tux7XP1",
    apiVersion: "2024-03-04",
});

async function clearAndPopulate() {
    // --- CLEAR OLD DATA ---
    console.log("Clearing old data...");
    for (const type of ["pricingCategory", "customPackage", "blogPost", "coupon"]) {
        const ids = await client.fetch(`*[_type == "${type}"]._id`);
        for (const id of ids) await client.delete(id);
        console.log(`  Deleted ${ids.length} ${type} docs`);
    }

    // --- STANDARD PRICING CATEGORIES (4 groups) ---
    console.log("\nCreating pricing categories...");
    const categories = [
        {
            _type: "pricingCategory", id: "8-9", label: "8-9 Students", order: 1,
            packages: [
                {
                    planName: "Discover", price: 5500, paymentButtonId: "pl_RwDuOx96VYrsyN", isPremium: false, _key: "pkg1",
                    features: [
                        { text: "Psychometric assessment", included: true, _key: "f1" },
                        { text: "1 career counselling session", included: true, _key: "f2" },
                        { text: "Lifetime Knowledge Gateway access", included: true, _key: "f3" },
                        { text: "Live webinar invites", included: true, _key: "f4" }
                    ]
                },
                {
                    planName: "Discover Plus+", price: 15000, paymentButtonId: "pl_RwDq8XpK76OhB3", isPremium: true, _key: "pkg2",
                    features: [
                        { text: "Psychometric assessments", included: true, _key: "f1" },
                        { text: "8 career counselling sessions (1/year)", included: true, _key: "f2" },
                        { text: "Custom reports & study abroad guidance", included: true, _key: "f3" },
                        { text: "CV building", included: true, _key: "f4" }
                    ]
                }
            ]
        },
        {
            _type: "pricingCategory", id: "10-12", label: "10-12 Students", order: 2,
            packages: [
                {
                    planName: "Achieve Online", price: 5999, paymentButtonId: "pl_RwDxvLPQP7j4rG", isPremium: false, _key: "pkg3",
                    features: [
                        { text: "Psychometric assessment", included: true, _key: "f1" },
                        { text: "1 career counselling session", included: true, _key: "f2" },
                        { text: "Lifetime Knowledge Gateway access", included: true, _key: "f3" },
                        { text: "Pre-recorded webinars", included: true, _key: "f4" }
                    ]
                },
                {
                    planName: "Achieve Plus+", price: 10599, paymentButtonId: "pl_RwDzfVkQYEdAIf", isPremium: true, _key: "pkg4",
                    features: [
                        { text: "Psychometric assessment", included: true, _key: "f1" },
                        { text: "4 career counselling sessions", included: true, _key: "f2" },
                        { text: "Custom reports & study abroad guidance", included: true, _key: "f3" },
                        { text: "CV reviews", included: true, _key: "f4" }
                    ]
                }
            ]
        },
        {
            _type: "pricingCategory", id: "graduates", label: "Graduates", order: 3,
            packages: [
                {
                    planName: "Ascend Online", price: 6499, paymentButtonId: "pl_RwE1evNHrHWJDW", isPremium: false, _key: "pkg5",
                    features: [
                        { text: "Psychometric assessment", included: true, _key: "f1" },
                        { text: "1 career counselling session", included: true, _key: "f2" },
                        { text: "Lifetime Knowledge Gateway access", included: true, _key: "f3" },
                        { text: "Pre-recorded webinars", included: true, _key: "f4" }
                    ]
                },
                {
                    planName: "Ascend Plus+", price: 10599, paymentButtonId: "pl_RwE3WEILWB9WeJ", isPremium: true, _key: "pkg6",
                    features: [
                        { text: "Psychometric assessment", included: true, _key: "f1" },
                        { text: "3 career counselling sessions", included: true, _key: "f2" },
                        { text: "Certificate/online course info", included: true, _key: "f3" },
                        { text: "CV reviews for jobs", included: true, _key: "f4" }
                    ]
                }
            ]
        },
        {
            _type: "pricingCategory", id: "working", label: "Working Professionals", order: 4,
            packages: [
                {
                    planName: "Ascend Online", price: 6499, paymentButtonId: "pl_RwE1evNHrHWJDW", isPremium: false, _key: "mp3",
                    features: [
                        { text: "Psychometric assessment", included: true, _key: "f1" },
                        { text: "1 career counselling session", included: true, _key: "f2" },
                        { text: "Lifetime Knowledge Gateway access", included: true, _key: "f3" },
                        { text: "Pre-recorded webinars", included: true, _key: "f4" }
                    ]
                },
                {
                    planName: "Ascend Plus+", price: 10599, paymentButtonId: "pl_RwE3WEILWB9WeJ", isPremium: true, _key: "mp2",
                    features: [
                        { text: "Psychometric assessment", included: true, _key: "f1" },
                        { text: "3 career counselling sessions", included: true, _key: "f2" },
                        { text: "Certificate/online course info", included: true, _key: "f3" },
                        { text: "CV reviews for jobs", included: true, _key: "f4" }
                    ]
                }
            ]
        }
    ];
    for (const cat of categories) {
        await client.create(cat);
        console.log(`  Created: ${cat.label}`);
    }

    // --- CUSTOM PACKAGES (7) ---
    console.log("\nCreating custom packages...");
    const customs = [
        {
            _type: "customPackage", planId: "career-report", title: "Career Report", price: 1500, order: 1,
            description: "Get a detailed report of your psychometric assessment for a scientific analysis of your interests. Find out where your interests lie and which future paths you can potentially consider."
        },
        {
            _type: "customPackage", planId: "career-report-counselling", title: "Career Report + Career Counselling", price: 3000, order: 2,
            description: "Connect with India's top career coaches to analyse your psychometric report and shortlist the top three career paths you're most likely to enjoy and excel at."
        },
        {
            _type: "customPackage", planId: "knowledge-gateway", title: "Knowledge Gateway + Career Helpline Access", price: 100, order: 3,
            description: "Unlock holistic information on your career paths and get direct access to Mentoria's experts, who will resolve your career-related queries through our dedicated Career Helpline."
        },
        {
            _type: "customPackage", planId: "one-to-one-session", title: "One-to-One Session with a Career Expert", price: 3500, order: 4,
            description: "Resolve your career queries and glimpse into your future world through a one-on-one session with an expert from your chosen field."
        },
        {
            _type: "customPackage", planId: "college-admission-planning", title: "College Admission Planning", price: 3000, order: 5,
            description: "Get unbiased recommendations and details on your future college options in India and abroad, organised in one resourceful planner."
        },
        {
            _type: "customPackage", planId: "exam-stress-management", title: "Exam Stress Management", price: 1000, order: 6,
            description: "Get expert guidance on tackling exam stress, planning your study schedule, revision tips and more from India's top educators."
        },
        {
            _type: "customPackage", planId: "cap-100", title: "College Admissions Planner - 100 (CAP-100)", price: 199, order: 7,
            description: "Get an expert-curated ranked list of the top 100 colleges in your course based on verified cut-offs. CAP-100 ranks colleges into four tiers: Indian Ivy League, Target, Smart Backup, and Safe Bet."
        },
    ];
    for (const pkg of customs) {
        await client.create(pkg);
        console.log(`  Created: ${pkg.title}`);
    }

    // --- BLOG POSTS ---
    console.log("\nCreating blog posts...");
    const blogs = [
        { _type: "blogPost", title: "How to Choose the Right Career Path After 12th", excerpt: "Confused about what to do after 12th? Here are proven strategies to identify your ideal career path based on your interests and strengths.", content: "Choosing a career after 12th is one of the most important decisions you'll make. Start by understanding your interests through psychometric assessments. Explore various fields - don't limit yourself to just engineering or medicine. Consider emerging careers in AI, data science, UX design, and digital marketing. Talk to professionals in fields that interest you. Remember, the right career is one that aligns with your natural strengths and passions.", category: "Career Guidance", date: "2024-12-15", readTime: "5 min read", isPublished: true },
        { _type: "blogPost", title: "5 Interview Tips That Will Land You Your Dream Job", excerpt: "Master these five essential interview techniques that top career coaches recommend for standing out from the competition.", content: "1. Research the company thoroughly - understand their mission, recent news, and culture. 2. Practice the STAR method for behavioral questions. 3. Prepare thoughtful questions to ask the interviewer. 4. Dress appropriately and arrive 10 minutes early. 5. Follow up with a thank-you email within 24 hours. These simple yet powerful techniques can dramatically improve your interview success rate.", category: "Interview", date: "2024-11-28", readTime: "4 min read", isPublished: true },
        { _type: "blogPost", title: "Building a Growth Mindset for Career Success", excerpt: "Learn how developing a growth mindset can transform your professional life and open doors to opportunities you never imagined.", content: "A growth mindset is the belief that abilities can be developed through dedication and hard work. In your career, this means embracing challenges, learning from criticism, and finding inspiration in others' success. Start by reframing failures as learning opportunities. Set stretch goals that push you beyond your comfort zone. Surround yourself with mentors and peers who challenge you to grow.", category: "Mindset", date: "2024-11-10", readTime: "6 min read", isPublished: true },
        { _type: "blogPost", title: "Resume Building: The Ultimate Guide for 2025", excerpt: "Your resume is your first impression. Learn how to craft a compelling resume that gets you shortlisted every time.", content: "A great resume tells your professional story in a clear, compelling way. Use action verbs to describe achievements, not just responsibilities. Quantify your impact with numbers wherever possible. Tailor your resume for each application. Keep it to 1-2 pages and use a clean, professional format. Include relevant keywords from the job description to pass ATS screening.", category: "Resume", date: "2024-10-22", readTime: "7 min read", isPublished: true },
        { _type: "blogPost", title: "Networking Strategies That Actually Work", excerpt: "Discover genuine networking approaches that build meaningful professional relationships without feeling awkward or salesy.", content: "Effective networking is about building genuine relationships, not collecting business cards. Start by offering value before asking for anything. Attend industry events and engage in meaningful conversations. Use LinkedIn strategically - comment on posts, share insights, and connect with purpose. Follow up consistently and nurture relationships over time. Remember, your network is your net worth.", category: "Networking", date: "2024-10-05", readTime: "5 min read", isPublished: true },
        { _type: "blogPost", title: "Career Transition: How to Switch Fields Successfully", excerpt: "Thinking of changing careers? Here's a step-by-step guide to making a smooth and successful career transition.", content: "Career transitions are increasingly common and can be incredibly rewarding. Start by identifying transferable skills from your current role. Invest in upskilling through courses and certifications. Build a portfolio or gain experience through freelance projects. Network with professionals in your target field. Be patient - transitions take time but are absolutely possible with the right strategy.", category: "Career Tips", date: "2024-09-18", readTime: "6 min read", isPublished: true },
    ];
    for (const blog of blogs) {
        await client.create(blog);
        console.log(`  Created: ${blog.title.substring(0, 40)}...`);
    }

    // --- COUPONS ---
    console.log("\nCreating coupons...");
    const coupons = [
        { _type: "coupon", code: "WELCOME10", discountPercent: 10, isActive: true, description: "10% off for new users" },
        { _type: "coupon", code: "CAREER20", discountPercent: 20, isActive: true, description: "20% off on career packages" },
        { _type: "coupon", code: "MENTORIA15", discountPercent: 15, isActive: true, description: "15% off Mentoria plans" },
    ];
    for (const cp of coupons) {
        await client.create(cp);
        console.log(`  Created: ${cp.code}`);
    }

    console.log("\n=== ALL SANITY DATA POPULATED SUCCESSFULLY ===");
}

clearAndPopulate().catch(err => console.error("FATAL:", err.message));
