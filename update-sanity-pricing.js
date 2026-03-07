import { createClient } from '@sanity/client';

const projectId = '2saavkiq';
const dataset = 'production';
const token = 'skbYQRN3iBjvFexIM1kXgxiMKuhfs516ooCbcsag7gYXO3XFv0V3BwusQkmmDCKmC2sXbJQsN9qsEiyH0EVbvgN3Ixom1GxheJgaCVYuhPM0fnBby0U9UhNkqyqGSm0aHJyLsTIxJsVAPXTuPYqHS2UtBw5gYO49ViCqqFZm1WT30tux7XP1';

const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    token,
    apiVersion: '2024-03-04',
});

const standardCategories = [
    {
        _type: 'pricingCategory',
        id: '8-9',
        label: '8-9 Students',
        order: 1,
        packages: [
            {
                planName: 'Discover',
                price: 5500,
                paymentButtonId: 'pl_RwDuOx96VYrsyN',
                isPremium: false,
                features: [
                    { text: "Psychometric assessment", included: true, _key: 'f1' },
                    { text: "1 career counselling session", included: true, _key: 'f2' },
                    { text: "Lifetime Knowledge Gateway access", included: true, _key: 'f3' },
                    { text: "Live webinar invites", included: true, _key: 'f4' }
                ],
                _key: 'pkg-1'
            },
            {
                planName: 'Discover Plus+',
                price: 15000,
                paymentButtonId: 'pl_RwDq8XpK76OhB3',
                isPremium: true,
                features: [
                    { text: "Psychometric assessments", included: true, _key: 'f1' },
                    { text: "8 career counselling sessions (1/year)", included: true, _key: 'f2' },
                    { text: "Custom reports & study abroad guidance", included: true, _key: 'f3' },
                    { text: "CV building", included: true, _key: 'f4' }
                ],
                _key: 'pkg-2'
            }
        ]
    },
    {
        _type: 'pricingCategory',
        id: '10-12',
        label: '10-12 Students',
        order: 2,
        packages: [
            {
                planName: 'Achieve Online',
                price: 5999,
                paymentButtonId: 'pl_RwDxvLPQP7j4rG',
                isPremium: false,
                features: [
                    { text: "Psychometric assessment", included: true, _key: 'f1' },
                    { text: "1 career counselling session", included: true, _key: 'f2' },
                    { text: "Lifetime Knowledge Gateway access", included: true, _key: 'f3' },
                    { text: "Pre-recorded webinars", included: true, _key: 'f4' }
                ],
                _key: 'pkg-3'
            },
            {
                planName: 'Achieve Plus+',
                price: 10599,
                paymentButtonId: 'pl_RwDzfVkQYEdAIf',
                isPremium: true,
                features: [
                    { text: "Psychometric assessment", included: true, _key: 'f1' },
                    { text: "4 career counselling sessions", included: true, _key: 'f2' },
                    { text: "Custom reports & study abroad guidance", included: true, _key: 'f3' },
                    { text: "CV reviews", included: true, _key: 'f4' }
                ],
                _key: 'pkg-4'
            }
        ]
    },
    {
        _type: 'pricingCategory',
        id: 'graduates',
        label: 'Graduates',
        order: 3,
        packages: [
            {
                planName: 'Ascend Online',
                price: 6499,
                paymentButtonId: 'pl_RwE1evNHrHWJDW',
                isPremium: false,
                features: [
                    { text: "Psychometric assessment", included: true, _key: 'f1' },
                    { text: "1 career counselling session", included: true, _key: 'f2' },
                    { text: "Lifetime Knowledge Gateway access", included: true, _key: 'f3' },
                    { text: "Pre-recorded webinars", included: true, _key: 'f4' }
                ],
                _key: 'pkg-5'
            },
            {
                planName: 'Ascend Plus+',
                price: 10599,
                paymentButtonId: 'pl_RwE3WEILWB9WeJ',
                isPremium: true,
                features: [
                    { text: "Psychometric assessment", included: true, _key: 'f1' },
                    { text: "3 career counselling sessions", included: true, _key: 'f2' },
                    { text: "Certificate/online course info", included: true, _key: 'f3' },
                    { text: "CV reviews for jobs", included: true, _key: 'f4' }
                ],
                _key: 'pkg-6'
            }
        ]
    },
    {
        _type: 'pricingCategory',
        id: 'working',
        label: 'Working Professionals',
        order: 4,
        packages: [
            {
                planName: 'Ascend Online',
                price: 6499,
                paymentButtonId: 'pl_RwE1evNHrHWJDW',
                isPremium: false,
                features: [
                    { text: "Psychometric assessment", included: true, _key: 'f1' },
                    { text: "1 career counselling session", included: true, _key: 'f2' },
                    { text: "Lifetime Knowledge Gateway access", included: true, _key: 'f3' },
                    { text: "Pre-recorded webinars", included: true, _key: 'f4' }
                ],
                _key: 'mp-3'
            },
            {
                planName: 'Ascend Plus+',
                price: 10599,
                paymentButtonId: 'pl_RwE3WEILWB9WeJ',
                isPremium: true,
                features: [
                    { text: "Psychometric assessment", included: true, _key: 'f1' },
                    { text: "3 career counselling sessions", included: true, _key: 'f2' },
                    { text: "Certificate/online course info", included: true, _key: 'f3' },
                    { text: "CV reviews for jobs", included: true, _key: 'f4' }
                ],
                _key: 'mp-2'
            }
        ]
    }
];

const customPackages = [
    { _type: 'customPackage', planId: 'career-report', title: 'Career Report', price: 1500, description: "Get a detailed report of your psychometric assessment for a scientific analysis of your interests. Find out where your interests lie and which future paths you can potentially consider.", order: 1 },
    { _type: 'customPackage', planId: 'career-report-counselling', title: 'Career Report + Career Counselling', price: 3000, description: "Connect with India's top career coaches to analyse your psychometric report and shortlist the top three career paths you're most likely to enjoy and excel at.", order: 2 },
    { _type: 'customPackage', planId: 'knowledge-gateway', title: 'Knowledge Gateway + Career Helpline Access', price: 100, description: "Unlock holistic information on your career paths and get direct access to Mentoria's experts, who will resolve your career-related queries through our dedicated Career Helpline. Validate your career decisions from now until you land a job you love.", order: 3 },
    { _type: 'customPackage', planId: 'one-to-one-session', title: 'One-to-One Session with a Career Expert', price: 3500, description: "Resolve your career queries and glimpse into your future world through a one-on-one session with an expert from your chosen field.", order: 4 },
    { _type: 'customPackage', planId: 'college-admission-planning', title: 'College Admission Planning', price: 3000, description: "Get unbiased recommendations and details on your future college options in India and abroad, organised in one resourceful planner.", order: 5 },
    { _type: 'customPackage', planId: 'exam-stress-management', title: 'Exam Stress Management', price: 1000, description: "Get expert guidance on tackling exam stress, planning your study schedule, revision tips and more from India's top educators. Increase your chances of acing exams with a calm and clear mind.", order: 6 },
    { _type: 'customPackage', planId: 'cap-100', title: 'College Admissions Planner - 100 (CAP-100)', price: 199, description: "₹199 for a ranked list of the top 100 colleges in your course. Get an expert-curated list of colleges based on verified cut-offs. CAP-100 ranks the top 100 colleges into four tiers to help you plan smarter: Indian Ivy League, Target, Smart Backup, and Safe Bet colleges. You can then shortlist colleges based on where you stand!.", order: 7 },
];

async function updateSanity() {
    try {
        console.log("Deleting old pricing categories...");
        const existingCats = await client.fetch(`*[_type == "pricingCategory"]._id`);
        for (const id of existingCats) {
            await client.delete(id);
        }

        console.log("Deleting old custom packages...");
        const existingCustoms = await client.fetch(`*[_type == "customPackage"]._id`);
        for (const id of existingCustoms) {
            await client.delete(id);
        }

        console.log("Populating new standard categories...");
        for (const cat of standardCategories) {
            await client.create(cat);
            console.log(`Created standard category: ${cat.label}`);
        }

        console.log("Populating custom packages...");
        for (const pkg of customPackages) {
            await client.create(pkg);
            console.log(`Created custom package: ${pkg.title}`);
        }

        console.log("Successfully updated Sanity CMS with all new pricing data.");
    } catch (err) {
        console.error("Error updating CMS:", err.message);
    }
}

updateSanity();
