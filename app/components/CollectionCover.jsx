import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen-react';

function CollectionCover({collection}) {
  if (!collection || !collection.image) return null;

  return (
    <div className="collectioncover">
      <div className="collection-cover my-8 w-full mx-auto">
        <Link
          to={`/collections/${collection.handle}`}
          className="block relative"
        >
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
    </div>
  );
}

export default CollectionCover;
