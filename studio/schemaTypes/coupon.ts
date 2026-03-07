import { defineField, defineType } from 'sanity'

export const coupon = defineType({
    name: 'coupon',
    title: 'Coupon Code',
    type: 'document',
    fields: [
        defineField({
            name: 'code',
            title: 'Coupon Code',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'discountPercent',
            title: 'Discount Percentage',
            type: 'number',
            validation: (Rule) => Rule.required().min(1).max(100),
        }),
        defineField({
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'string',
        }),
    ],
})
