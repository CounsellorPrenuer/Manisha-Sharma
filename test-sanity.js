import { createClient } from "@sanity/client";

const client = createClient({
    projectId: "2saavkiq",
    dataset: "production",
    token: "skbYQRN3iBjvFexIM1kXgxiMKuhfs516ooCbcsag7gYXO3XFv0V3BwusQkmmDCKmC2sXbJQsN9qsEiyH0EVbvgN3Ixom1GxheJgaCVYuhPM0fnBby0U9UhNkqyqGSm0aHJyLsTIxJsVAPXTuPYqHS2UtBw5gYO49ViCqqFZm1WT30tux7XP1",
    useCdn: false,
    apiVersion: "2024-03-04",
});

async function test() {
    try {
        const r = await client.fetch('*[_type == "blogPost"]{ title }');
        console.log(`Success! Found ${r.length} blog posts.`);
        r.forEach(p => console.log(` - ${p.title}`));

        const cats = await client.fetch('*[_type == "pricingCategory"]{ label }');
        console.log(`\nFound ${cats.length} pricing categories.`);
        cats.forEach(c => console.log(` - ${c.label}`));
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

test();
