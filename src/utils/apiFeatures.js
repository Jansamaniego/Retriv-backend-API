// Utils
import catchAsync from './catchAsync';
import AppError from './appError';
import { Product } from '../models';

const apiFeatures = catchAsync(async (req, model, populate) => {
  let query;

  const results = {};

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 30;
  const skip = (page - 1) * limit;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'sortBy', 'page', 'limit', 'filter'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  if (
    !req.query.sortBy &&
    req.user &&
    model.collection.collectionName === 'products' &&
    !req.query.categories
  ) {
    const { preferredCategories } = req.user;

    const categoriesPriority = preferredCategories.reduce((acc, curr, idx) => {
      acc[curr] = 3 - idx;
      return acc;
    }, {});

    const aggregationResult = await model.aggregate([
      { $match: { name: { $regex: reqQuery.search || '', $options: 'i' } } },
      {
        $addFields: {
          priority: {
            $ifNull: [
              {
                $arrayElemAt: [
                  Object.values(categoriesPriority),
                  {
                    $indexOfArray: [
                      Object.keys(categoriesPriority),
                      { $toString: '$category' }
                    ]
                  }
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { priority: -1 } }
    ]);

    results.results = aggregationResult.slice(startIndex, endIndex);

    results.totalPages = Math.ceil(aggregationResult.length / limit);

    if (req.query.categories) {
      const selectedCategories = req.query.categories.split(',');

      results.results = results.results.filter((data) => {
        return selectedCategories.includes(data.category.toString());
      });
    }

    if (req.query.filter && req.query.filterBy) {
      const filterBy = req.query.filterBy;
      const filter = req.query.filter;

      results.results = results.results.filter((data) => {
        return data[filterBy].toString() === filter.toString();
      });
    }
  }

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  queryStr = queryStr.replace('search', 'name');

  const searchQueryObj = {};

  // Finding resource
  Object.entries(JSON.parse(queryStr)).forEach(([key, value]) => {
    if (key === 'name') searchQueryObj[key] = new RegExp(value, 'i');
  });

  query = model.find(searchQueryObj);

  if (!query) {
    throw new AppError('No Data Found', 400);
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort && req.query.sortBy) {
    let obj = {};
    let sortBy;

    if (req.query.sortBy === 'relevance') {
      sortBy = 'name';
    } else if (req.query.sortBy === 'latest') {
      sortBy = 'createdAt';
    } else if (req.query.sortBy === 'top-sales') {
      sortBy = 'quantitySold';
    } else if (req.query.sortBy === 'price') {
      sortBy = 'price';
    }

    const number = Number(req.query.sort);

    obj[sortBy] = number;

    query = query.sort(obj);
  }

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  query = await query;

  results.results = query.slice(startIndex, endIndex);

  results.totalPages = Math.ceil(query.length / limit);

  if (req.query.categories && model.collection.collectionName === 'products') {
    const selectedCategories = req.query.categories.split(',');

    const queryProducts = query.filter((data) => {
      return selectedCategories.includes(data.category.toString());
    });

    results.results = queryProducts.slice(startIndex, endIndex);

    results.totalPages = Math.ceil(queryProducts.length / limit);
  }

  if (
    req.query.filter &&
    req.query.filterBy &&
    model.collection.collectionName === 'products'
  ) {
    const filterBy = req.query.filterBy;
    const filter = req.query.filter;

    const queryProducts = query.filter((data) => {
      return data[filterBy].toString() === filter.toString();
    });

    results.results = queryProducts.slice(startIndex, endIndex);

    results.totalPages = Math.ceil(queryProducts.length / limit);
  }

  return results;
});

export default apiFeatures;
