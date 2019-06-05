import 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
	Page,
	Layout,
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';

const GET_PRODUCTS = gql`
  query getProducts {
  	products(first:10) {
      edges {
        node {
          title
          handle
          descriptionHtml
          id
          images(first: 1) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price
                id
              }
            }
          }
        }
      }
    }  
  }
`;

class ProductList extends React.Component {
	resourceList() {
		return (
			<Query query={GET_PRODUCTS}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          return (
            <ResourceList
              showHeader
              resourceName={{ singular: 'Product', plural: 'Products' }}
              items={data.products.edges}
              renderItem={item => {
                const media = (
                  <Thumbnail
                    source={
                      item.node.images.edges[0]
                        ? item.node.images.edges[0].node.originalSrc
                        : ''
                    }
                    alt={
                      item.node.images.edges[0]
                        ? item.node.images.edges[0].node.altText
                        : ''
                    }
                  />
                );
                const price = item.node.variants.edges[0].node.price;
                return (
                  <ResourceList.Item
                    id={item.node.id}
                    media={media}
                    accessibilityLabel={`View details for ${item.title}`}
                  >
                    <Stack>
                      <Stack.Item fill>
                        <h3>
                          <TextStyle variation="strong">
                            {item.node.title}
                          </TextStyle>
                        </h3>
                      </Stack.Item>
                      <Stack.Item>
                        <p>${price}</p>
                      </Stack.Item>
                    </Stack>
                  </ResourceList.Item>
                );
              }}
            />
          );
        }}
      </Query>
		)
	}
  render() {
  	return (
  		<Page>
  			<Layout>
  				<Layout.Section>
	  				<Card>
	  					{this.resourceList()}
	      		</Card>
      		</Layout.Section>
      	</Layout>
      </Page>
    );
  }
}

export default ProductList;