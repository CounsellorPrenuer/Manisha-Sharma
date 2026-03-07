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

const features89Discover = [
    { text: "Psychometric assessment to measure your interests", included: true, _key: "1" },
    { text: "1 career counselling session with expert career coaches", included: true, _key: "2" },
    { text: "Lifetime access to Knowledge Gateway", included: true, _key: "3" },
    { text: "Invites to live webinars by industry experts", included: true, _key: "4" },
    { text: "Customized reports after each session with education pathways", included: false, _key: "5" },
    { text: "Guidance on studying abroad", included: false, _key: "6" },
    { text: "CV building during internship/graduation", included: false, _key: "7" },
];

const features89DiscoverPlus = [
    { text: "Psychometric assessments to measure your interests, personality and abilities", included: true, _key: "1" },
    { text: "8 career counselling sessions (1 every year) until graduation", included: true, _key: "2" },
    { text: "Lifetime access to Knowledge Gateway", included: true, _key: "3" },
    { text: "Invites to live webinars by industry experts", included: true, _key: "4" },
    { text: "Customized reports after each session with education pathways", included: true, _key: "5" },
    { text: "Guidance on studying abroad", included: true, _key: "6" },
    { text: "CV building during internship/graduation", included: true, _key: "7" },
];

const features1012Achieve = [
    { text: "Psychometric assessment to measure your interests, personality and abilities", included: true, _key: "1" },
    { text: "1 career counselling session", included: true, _key: "2" },
    { text: "Lifetime access to Knowledge Gateway", included: true, _key: "3" },
    { text: "Pre-recorded webinars by industry experts", included: true, _key: "4" },
    { text: "Customized reports after each session with education pathways", included: false, _key: "5" },
    { text: "Guidance on studying abroad", included: false, _key: "6" },
    { text: "CV reviews during internship/graduation", included: false, _key: "7" },
];

const features1012AchievePlus = [
    { text: "Psychometric assessment to measure your interests, personality and abilities", included: true, _key: "1" },
    { text: "4 career counselling sessions", included: true, _key: "2" },
    { text: "Lifetime access to Knowledge Gateway", included: true, _key: "3" },
    { text: "Attend live webinars by industry experts", included: true, _key: "4" },
    { text: "Customized reports after each session with education pathways", included: true, _key: "5" },
    { text: "Guidance on studying abroad", included: true, _key: "6" },
    { text: "CV reviews during internship/graduation", included: true, _key: "7" },
];

const featuresCollegeWorkingAscend = [
    { text: "Psychometric assessment to measure your interests, personality and abilities", included: true, _key: "1" },
    { text: "1 career counselling session", included: true, _key: "2" },
    { text: "Lifetime access to Knowledge Gateway", included: true, _key: "3" },
    { text: "Pre-recorded webinars by industry experts", included: true, _key: "4" },
    { text: "Customized reports after each session with information on certificate/online courses", included: false, _key: "5" },
    { text: "Guidance on studying abroad", included: false, _key: "6" },
    { text: "CV reviews for job application", included: false, _key: "7" },
];

const featuresCollegeAscendPlus = [
    { text: "Psychometric assessment to measure your interests, personality and abilities", included: true, _key: "1" },
    { text: "3 career counselling sessions", included: true, _key: "2" },
    { text: "Lifetime access to Knowledge Gateway", included: true, _key: "3" },
    { text: "Attend live webinars by industry experts", included: true, _key: "4" },
    { text: "Customized reports after each session with information on certificate/online courses", included: true, _key: "5" },
    { text: "Guidance on studying abroad", included: true, _key: "6" },
    { text: "CV reviews for job application", included: true, _key: "7" },
];

const featuresWorkingAscendPlus = [
    { text: "Psychometric assessment to measure your interests, personality and abilities", included: true, _key: "1" },
    { text: "2 career counselling sessions", included: true, _key: "2" },
    { text: "Lifetime access to Knowledge Gateway", included: true, _key: "3" },
    { text: "Attend live webinars by industry experts", included: true, _key: "4" },
    { text: "Customized reports after each session with information on certificate/online courses", included: true, _key: "5" },
    { text: "Guidance on studying abroad", included: true, _key: "6" },
    { text: "CV reviews for job application", included: true, _key: "7" },
];

const pricingData = [
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
                features: features89Discover,
                _key: 'pkg-discover'
            },
            {
                planName: 'Discover Plus+',
                price: 15000,
                paymentButtonId: 'pl_RwDq8XpK76OhB3',
                isPremium: true,
                features: features89DiscoverPlus,
                _key: 'pkg-discover-plus'
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
                features: features1012Achieve,
                _key: 'pkg-achieve'
            },
            {
                planName: 'Achieve Plus+',
                price: 10599,
                paymentButtonId: 'pl_RwDzfVkQYEdAIf',
                isPremium: true,
                features: features1012AchievePlus,
                _key: 'pkg-achieve-plus'
            }
        ]
    },
    {
        _type: 'pricingCategory',
        id: 'college',
        label: 'College Graduates',
        order: 3,
        packages: [
            {
                planName: 'Ascend Online',
                price: 6499,
                paymentButtonId: 'pl_RwE1evNHrHWJDW',
                isPremium: false,
                features: featuresCollegeWorkingAscend,
                _key: 'pkg-college-ascend'
            },
            {
                planName: 'Ascend Plus+',
                price: 10599,
                paymentButtonId: 'pl_RwE3WEILWB9WeJ',
                isPremium: true,
                features: featuresCollegeAscendPlus,
                _key: 'pkg-college-ascend-plus'
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
                features: featuresCollegeWorkingAscend,
                _key: 'pkg-working-ascend'
            },
            {
                planName: 'Ascend Plus+',
                price: 10599,
                paymentButtonId: 'pl_RwE3WEILWB9WeJ',
                isPremium: true,
                features: featuresWorkingAscendPlus,
                _key: 'pkg-working-ascend-plus'
            }
        ]
    }
];

const blogData = [
    {
        _type: 'blogPost',
        title: 'The Future of Remote Work and Career Development',
        excerpt: 'Explore how remote work is reshaping career paths and what skills you need to thrive in the new digital workplace.',
        category: 'Career Advice',
        readTime: '5 min read',
        date: 'March 15, 2024',
        imageUrl: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&q=80',
        tags: ['Remote Work', 'Future of Work', 'Skills']
    },
    {
        _type: 'blogPost',
        title: 'Mastering the Art of Virtual Interviews',
        excerpt: 'A comprehensive guide to standing out in virtual interviews, from technical setup to body language and presentation.',
        category: 'Interview Tips',
        readTime: '7 min read',
        date: 'March 10, 2024',
        imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80',
        tags: ['Interview', 'Virtual', 'Preparation']
    },
    {
        _type: 'blogPost',
        title: 'Building a Resilient Career Mindset',
        excerpt: 'Learn strategies to develop mental toughness, overcome setbacks, and maintain motivation throughout your career journey.',
        category: 'Mindset',
        readTime: '6 min read',
        date: 'March 5, 2024',
        imageUrl: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80',
        tags: ['Mindset', 'Growth', 'Resilience']
    }
];

async function addCorsOrigin() {
    try {
        const url = `https://api.sanity.io/v1/projects/${projectId}/cors`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                origin: 'https://counsellorprenuer.github.io',
                allowCredentials: true
            })
        });
        const result = await res.json();
        console.log('CORS Origin Added:', result);

        const localhostRes = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                origin: 'http://localhost:*',
                allowCredentials: true
            })
        });
        console.log('Localhost CORS Added:', await localhostRes.json());
    } catch (err) {
        console.error('Error adding CORS origin:', err.message);
    }
}

async function populateData() {
    console.log('Populating data into Sanity...');
    try {
        for (const category of pricingData) {
            const res = await client.create(category);
            console.log(`Created pricing category: ${category.label} (${res._id})`);
        }

        for (const post of blogData) {
            const res = await client.create(post);
            console.log(`Created blog post: ${post.title} (${res._id})`);
        }

        console.log('Successfully populated all Sanity data!');
    } catch (err) {
        console.error('Error populating data:', err.message);
    }
}

async function main() {
    await addCorsOrigin();
    await populateData();
}

main();
