import React from 'react'
import BlogSlug from '../../components/frontend/BlogSlug'
import { useParams } from 'react-router';
import Meta from '../../components/frontend/Meta';
import Maps from '../../components/frontend/Maps';

const BlogSlugPage = () => {
    const { slug } = useParams(); // lấy ID từ URL

    return (
        <>
            <Meta title="Tin tức chi tiết" />
            <Maps title="Tin tức chi tiết" />
            <BlogSlug slug={slug} />
        </>
    )
}

export default BlogSlugPage