const Dictionary = require('../models/dictionary');
const translate = require('@vitalets/google-translate-api');

module.exports.show = async (req, res) => {
  

    const dictionaryValues = await Dictionary.find({importantInfo: false}).sort({date:1});
    const importantInfoValues = await Dictionary.find({importantInfo: true}).sort({date:1});
    res.render('dictionary', {dictionaryValues, importantInfoValues})

}

module.exports.showArchive = async (req, res) => {
    const archivedValues = await Dictionary.find({}).where('archivedAt').exists().sort({date:1});
    res.render('dictionary/index_archived', {archivedValues})

}

module.exports.add = async (req, res) => {
    const dictionary = new Dictionary();
    dictionary.titleHEB = (req.body.hebrew); 
    dictionary.titleENG = (req.body.english); 
    dictionary.titleARB = (req.body.arabic); 
    dictionary.link = (req.body.link); 
    dictionary.author = req.user._id;
    dictionary.author_name = req.user.username;
    dictionary.importantInfo = req.body.importantInfo || false;     
    req.app.locals.updatedPage = true;
    await dictionary.save();
    req.flash('success', 'Created new value!');
    res.redirect(`/dictionary?updated`);
}


module.exports.edit = async (req, res) => {
 
        const { valueId } = req.params;
        const value = await Dictionary.findById(valueId)
        if (!value) {
            req.flash('error', 'Cannot find that dictionary value!');
            return res.redirect('/dictionary');
        }
        res.render('dictionary/edit', { value });
    }

module.exports.update = async (req, res) => {
        const { valueId } = req.params;
        const dictionary = await Dictionary.findById(valueId);
        dictionary.titleHEB = (req.body.hebrew); 
        dictionary.titleENG = (req.body.english); 
        dictionary.titleARB = (req.body.arabic); 
        dictionary.link = (req.body.link); 
        dictionary.importantInfo = req.body.importantInfo || false;
        dictionary.date =req.body.date || Date();
        await dictionary.save();
        req.app.locals.updatedPage = true;
        req.flash('success', 'Successfully updated value!');
        res.redirect(`/dictionary?updated`)
    }


    
module.exports.unArchive =  async (req, res) => {
    const { valueId } = req.params;
    const value = await Dictionary.findById(valueId).where('archivedAt').exists();
        value.restore();
        req.app.locals.updatedPage = true;
        req.flash('success', 'The value is back to be active' );
        res.redirect('/dictionary?updated');
    }
    
module.exports.archive =  async (req, res) => {
        const { valueId } = req.params;
        const value = await Dictionary.findById(valueId)
        value.archive();
        req.app.locals.updatedPage = true;
        req.flash('success', 'value archived!' );
        res.redirect('/dictionary?updated');
    }
    

module.exports.deleteValue = async (req, res) => {
    const { valueId } = req.params;
    await Dictionary.findByIdAndDelete(valueId);
    req.app.locals.updatedPage = true;
    req.flash('success', 'Successfully deleted value')
    res.redirect(`/dictionary?updated`);
}


module.exports.showTranslate = async (req, res) => {

    const dictionary = new Dictionary();
    dictionary.titleHEB = (req.body.hebrew); 
    dictionary.titleENG = (req.body.english) || "";  
    dictionary.titleARB = (req.body.arabic) || ""; 
    dictionary.link = (req.body.link) || ""; 
    dictionary.author = req.user._id;
    dictionary.author_name = req.user.username;
    dictionary.importantInfo = req.body.importantInfo || false;     
    req.app.locals.updatedPage = true;

    let hebrewValue = "" 
    let englishValue = ""
    let arabicValue = ""

  if (dictionary.titleHEB) {
    await translate(dictionary.titleHEB, {to: 'en'}).then(result => {
            englishValue = result.text;
            }).catch(err => {
                console.error(err);
            });

        await translate(dictionary.titleHEB, {to: 'ar'}).then(result => {
            arabicValue = (result.text);
                                   
            }).catch(err => {
                console.error(err);
            });
    
        await translate(dictionary.titleHEB, {to: 'he'}).then(result => {
        hebrewValue = result.text;
            }).catch(err => {
                console.error(err);
            });
        }
    const dictionaryValues = await Dictionary.find({importantInfo: false}).sort({date:1});
    const importantInfoValues = await Dictionary.find({importantInfo: true}).sort({date:1});
    await res.render('dictionary/index_trans_updated', {dictionaryValues, importantInfoValues, hebrewValue, englishValue, arabicValue});


}