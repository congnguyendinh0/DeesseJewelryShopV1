import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import groq from 'groq';
import AccordionDemo from '~/components/Faq';
import CollectionCover from '~/components/CollectionCover';

export const meta = () => {
  return [{title: 'Home'}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context}) {
  const sanityQuery = groq`*[_type == 'Home']`;

  // Add a simple Sanity query to test
  const testSanityQuery = groq`*[_type == "testDocument"][0]`;

  const [
    {collections},
    featuredCollection,
    latestBlogs,
    sanityData,
    collageFooter,
    testSanityData, // Add this line
  ] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY),
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(LATEST_BLOGS_QUERY),
    context.sanity.client.fetch(sanityQuery),
    context.storefront.query(COLLAGE_FOOTER_QUERY),
    context.sanity.client.fetch(testSanityQuery), // Add this line
  ]);

  return {
    collections: collections?.nodes ?? [],
    featuredCollection: featuredCollection?.collections?.nodes?.[0] ?? null,
    latestBlogs: latestBlogs?.blogByHandle?.articles ?? [],
    sanityData,
    collageFooter: collageFooter?.metaobject ?? null,
    testSanityData, // Add this line
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData();
  const featuredCollection = data.collections[0] || data.featuredCollection;

  return (
    <div className="home px-4 sm:px-6 lg:px-8">
      {/* Add this block to display Sanity test data */}
      {data.testSanityData && (
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-4">Sanity Test Data</h2>
          <pre>{JSON.stringify(data.testSanityData, null, 2)}</pre>
        </div>
      )}
      {featuredCollection && (
        <CollectionCover collection={featuredCollection} />
      )}
      <RecommendedProducts products={data.recommendedProducts} />
      <LatestBlogs blogs={data.latestBlogs} />
      <h3 className="text-2xl font-medium my-12">About us</h3>
      <AccordionDemo className="max-w-lg my-12 "></AccordionDemo>
      <CollageFooter collageFooter={data.collageFooter} />
    </div>
  );
}
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products my-12">
      <h3 className="text-2xl font-semibold mb-6">Recommended Products</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {response?.products?.nodes?.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product group"
                  to={`/products/${product.handle}`}
                >
                  <div className="aspect-w-1 aspect-h-1 mb-4 overflow-hidden rounded-lg">
                    <Image
                      data={product.images.nodes[0]}
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-lg font-medium">{product.title}</h4>
                  <small className="text-gray-600">
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function LatestBlogs({blogs}) {
  if (!blogs || !blogs.nodes) {
    return null;
  }

  return (
    <div>
      <h3 className="text-2xl font-medium my-12">Latest Blog</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {blogs.nodes.map((item) => (
          <Link
            to={`blogs/news/${item.handle}`}
            key={item.id}
            className="block"
          >
            {item.image && (
              <Image
                data={item.image}
                aspectRatio="5/3"
                sizes="(min-width:45em) 20vw, 50vw"
                className="w-full h-auto object-cover mb-4"
              />
            )}
            <h4 className="text-lg font-medium">{item.title}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CollageFooter({collageFooter}) {
  if (!collageFooter || !collageFooter.fields) return null;

  const thumbnailField = collageFooter.fields.find(
    (field) => field.key === 'thumbnail',
  );
  if (!thumbnailField || !thumbnailField.reference) return null;

  return (
    <div className="collage-footer my-12">
      <h3 className="text-2xl font-semibold mb-6">Collage Footer</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {thumbnailField.reference.image && (
          <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
            <Image
              data={thumbnailField.reference.image}
              className="w-full h-full object-cover"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}

const LATEST_BLOGS_QUERY = `#graphql
  query LatestBlogs($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    blogByHandle(handle: "news") {
      title
      handle
      articles(first: 4) {
        nodes {
          id
          title
          handle
          excerpt
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `#graphql
  query Collections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

const FEATURED_COLLECTION_QUERY = `#graphql
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        image {
          id
          url
          altText
          width
          height
        }
        handle
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const COLLAGE_FOOTER_QUERY = `#graphql
  query CollageFooter($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "collage-uz10vcna", type: "collagefooter"}) {
      handle
      type
      fields {
        key
        value
        reference {
          ... on MediaImage {
            id
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;
