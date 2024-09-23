// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {createRequestHandler} from '@remix-run/server-runtime';

import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  createCustomerAccountClient,
} from '@shopify/hydrogen';

import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {createSanityLoader} from 'hydrogen-sanity';
import {createAdminClient} from 'app/lib/adminClient.js';

/**
 * Export a fetch handler in module format.
 */

export default async function (request) {
  try {
    const env = {
      SESSION_SECRET: '',
      PUBLIC_STOREFRONT_API_TOKEN: '',
      PRIVATE_STOREFRONT_API_TOKEN: '',
      PUBLIC_STORE_DOMAIN: '',
      PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: '',
      PUBLIC_CUSTOMER_ACCOUNT_API_URL: '',
      PUBLIC_CHECKOUT_DOMAIN: '',
      SANITY_PROJECT_ID: '',
      SANITY_DATASET: '',
      SANITY_API_VERSION: '',
    };

    env.SESSION_SECRET = process.env.SESSION_SECRET;
    env.PUBLIC_STOREFRONT_API_TOKEN = process.env.PUBLIC_STOREFRONT_API_TOKEN;
    env.PRIVATE_STOREFRONT_API_TOKEN = process.env.PRIVATE_STOREFRONT_API_TOKEN;
    env.PUBLIC_STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN;
    env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID =
      process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID;
    env.PUBLIC_CUSTOMER_ACCOUNT_API_URL =
      process.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL;
    env.PUBLIC_CHECKOUT_DOMAIN = process.env.PUBLIC_CHECKOUT_DOMAIN;
    env.SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
    env.SANITY_DATASET = process.env.SANITY_DATASET;
    env.SANITY_API_VERSION = process.env.SANITY_API_VERSION;

    if (!env?.SESSION_SECRET) {
      throw new Error('SESSION_SECRET process.environment variable is not set');
    }

    const [session] = await Promise.all([
      AppSession.init(request, [process.env.SESSION_SECRET]),
    ]);

    const {storefront} = createStorefrontClient({
      buyerIp: request.headers.get('x-forwarded-for') ?? undefined,
      i18n: {language: 'EN', country: 'US'},
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
    });

    const customerAccount = createCustomerAccountClient({
      request,
      session,
      customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
      customerAccountUrl: env.PUBLIC_CUSTOMER_ACCOUNT_API_URL,
    });

    const cart = createCartHandler({
      storefront,
      customerAccount,
      getCartId: cartGetIdDefault(request.headers),
      setCartId: cartSetIdDefault(),
      cartQueryFragment: CART_QUERY_FRAGMENT,
    });

    const {admin} = createAdminClient({
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      privateAdminToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      adminApiVersion: '2024-07',
    });

    const sanity = createSanityLoader({
      cache: caches.open('hydrogen'),
      client: {
        projectId: env.SANITY_PROJECT_ID,
        dataset: env.SANITY_DATASET,
        apiVersion: env.SANITY_API_VERSION || '2023-03-30',
        useCdn: process.env.NODE_ENV === 'production',
      },
    });

    const handleRequest = createRequestHandler(remixBuild, 'production');

    const response = await handleRequest(request, {
      session,
      storefront,
      admin,
      sanity,
      customerAccount,
      cart,
      env,
      waitUntil: () => Promise.resolve(),
    });

    if (session.isPending) {
      response.headers.set('Set-Cookie', await session.commit());
    }

    if (response.status === 404) {
      // Handle 404 logic if necessary
    }

    return response;
  } catch (error) {
    console.error(error);
    return new Response('An unexpected error occurred', {status: 500});
  }
}
