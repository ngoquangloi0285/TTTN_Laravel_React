import React from 'react'
import BlogSlug from '../../components/frontend/BlogSlug'
import { useParams } from 'react-router';
import Meta from '../../components/frontend/Meta';
import Maps from '../../components/frontend/Maps';

const BlogSlugPage = () => {
    const { slug } = useParams(); // lấy ID từ URL

    return (
        <>
            <Meta title="News Detail" />
            <Maps title="News Detail" />
            <BlogSlug slug={slug} />
        </>
    )
}

export default BlogSlugPage