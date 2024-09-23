export function createAdminClient({
  storeDomain,
  privateAdminToken,
  adminApiVersion,
}) {
  const admin = async function (query, variables = {}) {
    if (!query) {
      throw Error('Query is required');
    }

    const endpoint = `https://${storeDomain}/admin/api/${adminApiVersion}/graphql.json`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': privateAdminToken,
      },
      body: JSON.stringify({query, variables}),
    };

    const request = await fetch(endpoint, options);

    if (!request.ok) {
      const errorText = await request.text();
      throw new Error(`GraphQL request failed: ${errorText}`);
    }

    const response = await request.json();

    if (response?.errors?.length) {
      throw new Error(response.errors[0].message);
    }

    return response;
  };

  return {admin};
}
