const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    coordinatesN: Joi.number().allow(null).allow(''),
    coordinatesE: Joi.number().allow(null).allow(''),
        campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array(), 
    contact : Joi.object({
    name: Joi.string().allow(null).allow("").escapeHTML(),
phone: Joi.string().allow(null).allow("").escapeHTML()
    })
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().escapeHTML()
    }).required()
})


module.exports.dictionarySchema = Joi.object({
    hebrew: Joi.string().required().escapeHTML(),
    english: Joi.string().allow(null).allow('').escapeHTML(),
    arabic: Joi.string().allow(null).allow('').escapeHTML(),
    link: Joi.string().optional().allow(null).allow('').escapeHTML(),
    importantInfo: Joi.any(),

    
})
