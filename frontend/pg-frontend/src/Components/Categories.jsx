import { categories } from "../catDB";
import "../Styles/Categories.scss"
import { Link } from "react-router-dom";
import React from "react";


const Categories = () => {
    return (
        <div className="categories">
            <h1>Explore Top Categories</h1>
            <p>
                Discover the perfect place to stay with Room Maven. Whether you're traveling for work or leisure, find your ideal accommodation and experience the comfort and convenience of home, wherever you go.
            </p>

            <div className="categories_list">
                {categories?.slice(1, 7).map((category, index) => (
                    <Link to={`/properties/category/${category.label}`}>
                        <div className="category" key={category.label}>
                            <img src={category.img} alt={category.label} />
                            <div className="overlay"></div>
                            <div className="category_text">
                                <div className="category_text_icon">{category.icon}</div>
                                <p>{category.label}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;