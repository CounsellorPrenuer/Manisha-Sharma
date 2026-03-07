import { defineField, defineType } from 'sanity'

export const customPackage = defineType({
    name: 'customPackage',
    title: 'Custom Package',
    type: 'document',
    fields: [
        defineField({
            name: 'planId',
            title: 'Plan ID',
            type: 'string',
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
        }),
        defineField({
            name: 'image',
            title: 'Package Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
    ],
})
