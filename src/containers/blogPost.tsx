import React from 'react';
import Content from './content';
import {graphql, Link} from 'gatsby';
import {BlogDataQuery} from '../../graphql-types';
import BackgroundImage from 'gatsby-background-image';
// @ts-ignore
import * as styles from '../styles/blog.module.scss';

import 'prismjs/themes/prism.css'; // remark code snipits
import 'katex/dist/katex.min.css';
import {Button} from 'react-bootstrap'; // maths

interface BlogPostProps {
    data: BlogDataQuery;
}

function BlogPost(props: BlogPostProps) {
    const fluidImg = props.data.markdownRemark.frontmatter.image ? props.data.markdownRemark.frontmatter.image.childImageSharp.fluid : undefined;
    const title = props.data.markdownRemark.frontmatter.title;
    const postDate = props.data.markdownRemark.frontmatter.date;
    return (
        <Content>
            <div className={styles.blogPost}>
                {/*<Button onClick={()=>navigate("/blog")}>blog home</Button>*/}
                {fluidImg && (
                    <BackgroundImage className={styles.backgroundImg} fluid={[`linear-gradient(rgba(245, 245, 245, 0.55), rgba(245, 245, 245, 0.9))`, fluidImg]}>
                        <h1>{title}</h1>
                        <h3>{postDate}</h3>
                    </BackgroundImage>
                )}
                <hr />
                <div
                    dangerouslySetInnerHTML={{
                        __html: props.data.markdownRemark.html
                    }}
                />
            </div>
        </Content>
    );
}

export const query = graphql`
    query blogData($slug: String!) {
        markdownRemark(fields: {slug: {eq: $slug}}) {
            html
            frontmatter {
                title
                date(formatString: "dddd, MMMM Do YYYY")
                tags
                image {
                    childImageSharp {
                        # Specify the image processing specifications right in the query.
                        # Makes it trivial to update as your page's design changes.
                        fluid {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
        }
    }
`;
export default BlogPost;
