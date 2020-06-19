import React, {SyntheticEvent, useState} from 'react';
import {graphql} from 'gatsby';
import Content from '../containers/content';
import {BlogHomeQuery, GatsbyImageSharpFluidFragment, ImageSharpFluid} from '../../graphql-types';
// @ts-ignore
import * as style from '../styles/blog.module.scss';
import BlogPostCard from '../components/blogPostCard';
import {InputGroup, FormControl} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import LoadingOverlay from '../../../leftovers/leftovers-ui/src/app/containers/overlays/loadingOverlay';

interface BlogProps {
    data: BlogHomeQuery;
}

const Blog = (props: BlogProps) => {
    let [posts, setPosts] = useState(props.data.allMarkdownRemark.edges);
    let [isLoading, setIsLoading] = useState<boolean>(false)

    function filterPosts(e: SyntheticEvent) {
        setIsLoading(true)
        let target = e.target as HTMLInputElement;
        let res = props.data.allMarkdownRemark.edges.filter((post) => {
            let searchResContent = post.node.internal.content.toLowerCase().indexOf(target.value.toLowerCase());
            let searchResTitle = post.node.frontmatter.title.toLowerCase().indexOf(target.value.toLowerCase());
            let searchResTags = post.node.frontmatter.tags.join(' ').toLowerCase().indexOf(target.value.toLowerCase());
            return searchResContent >= 0 || searchResTitle >= 0 || searchResTags >= 0;
        });
        setPosts(res);
        setIsLoading(false)
    }

    return (<Content>
        <h2 data-aos="fade-right" data-aos-duration="800" data-aos-delay="0">
            Welcome to the Blog!
        </h2>
        <p className={style.blogIntro} data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
            I write about things sometime, so far there are {props.data.allMarkdownRemark.totalCount} posts. I update
            this every now and then when I come across something I want to write about. Most of these are just ramblings
            and notes from when I want to remember something. Its mostly about tech and code and notes I find
            interesting.
        </p>
        <InputGroup size="sm" data-aos="fade-up" data-aos-duration="600" data-aos-delay="350">
            <FormControl placeholder="Search..." defaultValue='' aria-label="Small"
                         onChange={filterPosts}/>
        </InputGroup>
        <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
            <hr/>
            <LoadingOverlay isLoading={isLoading}>
                {posts.length > 0 && posts.filter((post) => {
                    // filter dates in the future so we dont publish in the daily build
                    let isPastPost = post.node.frontmatter.isoDate < new Date().toISOString();
                    // also run search match

                    // console.log(isPastPost, searchTerm, searchMatch, post.node.frontmatter.title);
                    // return isPastPost || searchMatch || searchTerm === '';
                    return isPastPost;
                }).sort((e1: any, e2: any) => {
                    return Date.parse(e2.node.frontmatter.isoDate) - Date.parse(e1.node.frontmatter.isoDate);
                }).map((edge: any, idx: number) => {
                    const {excerpt, fields, frontmatter} = edge.node;
                    const imgData: ImageSharpFluid | null | GatsbyImageSharpFluidFragment = edge.node.frontmatter.image
                        ? edge.node.frontmatter.image.childImageSharp.fluid
                        : undefined;

                    return (
                        <BlogPostCard
                            key={idx}
                            idx={idx}
                            imgData={imgData}
                            slug={fields.slug}
                            title={frontmatter.title}
                            date={frontmatter.date}
                            excerpt={excerpt}
                        />
                    );
                })}
                {posts.length === 0 && <p>No results...</p>}
            </LoadingOverlay>
        </div>
    </Content>);
};

export const query = graphql`
    query blogHome {
        allMarkdownRemark {
            totalCount
            edges {
                node {
                    id
                    frontmatter {
                        title
                        isoDate: date
                        date(formatString: "dddd, MMMM Do YYYY")
                        tags
                        image {
                            childImageSharp {
                                fluid {
                                    ...GatsbyImageSharpFluid
                                }
                            }
                        }
                    }
                    excerpt
                    fields {
                        slug
                    }
                    internal {
                        content
                    }
                }
            }
        }
    }
`;

export default Blog;
