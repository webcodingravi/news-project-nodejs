import NewsModel from "../model/news.model.js"
import CategoryModel from "../model/category.model.js"
import SettingModel from "../model/setting.model.js"
import NodeCache from "node-cache"



const cache=new NodeCache();

const loadCommonDta=async (req, res, next) => {
    try {
        var latestNews=cache.get('latestNewsCache')
        var categories=cache.get('categoriesCache')
        var settings=cache.get('settingsCache')


        if (!latestNews&&!categories&&!settings) {
            settings=await SettingModel.findOne()
            latestNews=await NewsModel.find()
                .populate('category', { 'name': 1, 'slug': 1 })
                .populate('author', 'fullname')
                .sort({ createdAt: -1 })
                .limit(5).lean()

            const categoriesInUse=await NewsModel.distinct('category')
            categories=await CategoryModel.find({ '_id': { $in: categoriesInUse } }).lean()

            cache.set('latestNewsCache', latestNews, 3600)
            cache.set('categoriesCache', categories, 3600)
            cache.set('settingsCache', settings, 3600)

        }

        res.locals.settings=settings
        res.locals.latestNews=latestNews
        res.locals.categories=categories
        next();
    }
    catch (err) {
        console.error(err)
    }
}

export default loadCommonDta;