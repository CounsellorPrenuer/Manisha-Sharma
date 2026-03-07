import { defineField, defineType } from 'sanity'

export const pricingCategory = defineType({
    name: 'pricingCategory',
    title: 'Pricing Category',
    type: 'document',
    fields: [
        defineField({
            name: 'id',
            title: 'ID',
            type: 'string',
        }),
        defineField({
            name: 'label',
            title: 'Category Label',
            type: 'string',
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
        }),
        defineField({
            name: 'packages',
            title: 'Packages',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'planName', title: 'Plan Name', type: 'string' }),
                        defineField({ name: 'price', title: 'Price', type: 'number' }),
                        defineField({ name: 'paymentButtonId', title: 'Payment Button ID', type: 'string' }),
                        defineField({ name: 'isPremium', title: 'Is Premium', type: 'boolean' }),
                        defineField({
                            name: 'features',
                            title: 'Features',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        defineField({ name: 'text', title: 'Feature Text', type: 'string' }),
                                        defineField({ name: 'included', title: 'Is Included', type: 'boolean' })
                                    ]
                                }
                            ]
                        })
                    ]
                }
            ]
        }),
    ],
})
