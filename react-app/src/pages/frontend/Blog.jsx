import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Maps from '../../components/frontend/Maps';
import Meta from '../../components/frontend/Meta';
import BlogCard from '../../components/frontend/BlogCard';
import axios from '../../api/axios';
import './blog.css'
const Blog = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [categoryResponse] = await Promise.all([
        axios.get('/api/category/v1/category')
      ]);

      const categoryMap = {};
      const categoryList = categoryResponse.data;

      categoryList.forEach((category) => {
        categoryMap[category.id] = category;
        category.children = []; // Thêm thuộc tính children cho mỗi category
      });

      const categoryTree = [];
      categoryList.forEach((category) => {
        if (category.parent_category) {
          // Nếu category có parent_category, thêm nó vào danh sách con của category cha tương ứng
          categoryMap[category.parent_category].children.push(category);
        } else {
          // Nếu không có parent_category, nó là category gốc, thêm vào danh sách gốc
          categoryTree.push(category);
        }
      });

      setCategoryList(categoryTree);
      setCategoryMap(categoryMap);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Meta title={"Blog"} />
      <Maps title="Blog" />
      <div className="blog-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-3">
              <div className="filter-card mb-3">
                <h3 className="filter-title">
                  Find By Categories
                </h3>
                <div className='container'>
                  <div className="row filter-mx">
                    <div className="col-12 blog-category">
                      <ul className="ps-0 menu">
                        {categoryList.map((category) => (
                          <li key={category.id}>
                            <Link to={`../blog/category/${category.slug}`} >{category.name_category}</Link>
                            {category.children.length > 0 && (
                              <ul>
                                {category.children.map((subcategory) => (
                                  <li key={subcategory.id}>
                                    <Link to={`../blog/category/${subcategory.slug}`}>
                                      {subcategory.name_category}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                        <li>
                        </li>
                        <li><Link to="">Other News</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="row">
                <BlogCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Blog