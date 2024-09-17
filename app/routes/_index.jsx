import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

export const meta = () => {
  return [{title: 'Deesse Jewelry | Home'}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context}) {
  const [{collections}, featuredCollection] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY),
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    collections: collections.nodes,
    featuredCollection: featuredCollection.collections.nodes[0],
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
      {featuredCollection && (
        <CollectionCover collection={featuredCollection} />
      )}
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function CollectionCover({collection}) {
  if (!collection || !collection.image) return null;

  return (
    // Remove the max-w-screen-md class and use w-full to take full width
    <div className="collection-cover my-8 w-full mx-auto">
      <Link to={`/collections/${collection.handle}`} className="block relative">
        {/* Use the aspect-w-16 aspect-h-9 classes to enforce the 16:9 aspect ratio */}
        <div className="relative w-full" style={{paddingTop: '56.25%'}}>
          <div className="absolute inset-0 overflow-hidden rounded-lg shadow-md">
            <Image
              data={collection.image}
              className="w-full h-full object-cover"
              style={{objectFit: 'cover'}}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {collection.title}
                </h2>
                <button className="bg-white text-black font-semibold py-2 px-4 rounded-full hover:bg-opacity-90 transition duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
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
              {response
                ? response.products.nodes.map((product) => (
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
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

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
