import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
    projectId: "2saavkiq",
    dataset: "production",
    useCdn: true,
    apiVersion: "2024-03-04",
});

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
    return builder.image(source)
}
