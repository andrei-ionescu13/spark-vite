import { createBrowserRouter, Outlet, useLoaderData } from 'react-router';
import { AuthLayout } from './auth-layout';
import { AuthProvider } from './contexts/auth-context';
import { DashboardLayout } from './layout';
import { Login } from './modules/auth/login';
import { Register } from './modules/auth/register';
import { ArticleCreate } from './modules/blog/articles/article-create/page';
import { Article } from './modules/blog/articles/article/page';
import { Articles } from './modules/blog/articles/articles/page';
import { ArticleCategories } from './modules/blog/categories/page';
import { ArticleTags } from './modules/blog/tags/page';
import { Collection } from './modules/collections/collection/page';
import { Collections } from './modules/collections/collections/page';
import CollectionCreate from './modules/collections/create/page';
import { Currencies } from './modules/currencies/page';
import { Dashboard } from './modules/dashboard/page';
import DealCreate from './modules/deals/create/page';
import { Deal } from './modules/deals/deal/page';
import { Deals } from './modules/deals/deals/page';
import { Developers } from './modules/developers/page';
import { DiscountCreate } from './modules/discounts/discount-create/page';
import { Discount } from './modules/discounts/discount/page';
import { Discounts } from './modules/discounts/discounts/page';
import { Features } from './modules/features/page';
import { Genres } from './modules/genres/page';
import { Languages } from './modules/internationalization/languages/page';
import { Namespace } from './modules/internationalization/translations/namespace/page';
import { Namespaces } from './modules/internationalization/translations/namespaces/page';
import { Keys } from './modules/keys/page';
import { OperatingSystems } from './modules/operating-systems/page';
import { Order } from './modules/orders/order/page';
import { Orders } from './modules/orders/orders/page';
import { Platforms } from './modules/platforms/page';
import { ProductLayout } from './modules/products/components/product-layout';
import { ProductCreate } from './modules/products/create/page';
import { ProductKeys } from './modules/products/product-keys/page';
import { ProductReviews } from './modules/products/product-reviews/page';
import { Product } from './modules/products/product/page';
import { Products } from './modules/products/products/page';
import { PromoCodeCreate } from './modules/promo-codes/create/page';
import { PromoCode } from './modules/promo-codes/promo-code/page';
import { PromoCodes } from './modules/promo-codes/promo-codes/page';
import { Publishers } from './modules/publishers/page';
import { Review } from './modules/reviews/review/page';
import { Reviews } from './modules/reviews/reviews/page';
import { UserLayout } from './modules/users/layout';
import { UserOrders } from './modules/users/user-orders/page';
import { UserReviews } from './modules/users/user-reviews/page';
import { User } from './modules/users/user/page';
import { Users } from './modules/users/users/page';
import type { Admin } from './types/admin';
import { appFetch } from './utils/app-fetch';

const getAdmin = async () => {
  try {
    const admin = await appFetch<Admin>({
      withAuth: true,
      shouldRedirect: false,
      url: '/me',
      config: {
        method: 'GET',
        credentials: 'include',
      },
    });

    return { admin };
  } catch (error) {
    return { admin: null };
  }
};

export const RootLayout = () => {
  const { admin } = useLoaderData();

  return (
    <AuthProvider admin={admin}>
      <Outlet />
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    id: 'root',
    loader: getAdmin,
    Component: RootLayout,
    children: [
      {
        Component: AuthLayout,
        children: [
          { path: 'login', Component: Login },
          { path: 'register', Component: Register },
        ],
      },
      {
        path: '',
        Component: DashboardLayout,
        children: [
          { index: true, Component: Dashboard },
          {
            path: 'articles',
            children: [
              {
                index: true,
                Component: Articles,
              },
              {
                path: 'create',
                Component: ArticleCreate,
              },
              {
                path: 'categories',
                Component: ArticleCategories,
              },
              {
                path: 'tags',
                Component: ArticleTags,
              },
              {
                path: ':id',
                Component: Article,
              },
            ],
          },
          {
            path: 'namespaces',
            children: [
              {
                index: true,
                Component: Namespaces,
              },
              {
                path: ':id',
                Component: Namespace,
              },
            ],
          },
          {
            path: 'languages',
            Component: Languages,
          },
          {
            path: 'discounts',
            children: [
              {
                index: true,
                Component: Discounts,
              },
              {
                path: 'create',
                Component: DiscountCreate,
              },
              {
                path: ':id',
                Component: Discount,
              },
            ],
          },
          {
            path: 'products',
            children: [
              {
                index: true,
                Component: Products,
              },
              {
                path: 'create',
                Component: ProductCreate,
              },
              {
                path: 'deals',
                children: [
                  {
                    index: true,
                    Component: Deals,
                  },
                  {
                    path: 'create',
                    Component: DealCreate,
                  },
                  {
                    path: ':id',
                    Component: Deal,
                  },
                ],
              },
              {
                path: 'collections',
                children: [
                  {
                    index: true,
                    Component: Collections,
                  },
                  {
                    path: 'create',
                    Component: CollectionCreate,
                  },
                  {
                    path: ':id',
                    Component: Collection,
                  },
                ],
              },
              {
                path: 'platforms',
                Component: Platforms,
              },
              {
                path: 'keys',
                Component: Keys,
              },
              {
                path: 'publishers',
                Component: Publishers,
              },
              {
                path: 'genres',
                Component: Genres,
              },
              {
                path: 'developers',
                Component: Developers,
              },
              {
                path: 'features',
                Component: Features,
              },
              {
                path: 'operating-systems',
                Component: OperatingSystems,
              },
              {
                path: ':id',
                Component: ProductLayout,
                children: [
                  {
                    index: true,
                    Component: Product,
                  },
                  {
                    path: 'keys',
                    Component: ProductKeys,
                  },
                  {
                    path: 'reviews',
                    Component: ProductReviews,
                  },
                ],
              },
            ],
          },
          {
            path: 'promo-codes',
            children: [
              {
                index: true,
                Component: PromoCodes,
              },
              {
                path: 'create',
                Component: PromoCodeCreate,
              },
              {
                path: ':id',
                Component: PromoCode,
              },
            ],
          },
          {
            path: 'reviews',
            children: [
              {
                index: true,
                Component: Reviews,
              },
              {
                path: ':id',
                Component: Review,
              },
            ],
          },
          {
            path: 'users',
            children: [
              {
                index: true,
                Component: Users,
              },
              {
                path: ':id',
                Component: UserLayout,
                children: [
                  {
                    index: true,
                    Component: User,
                  },
                  {
                    path: 'orders',
                    Component: UserOrders,
                  },
                  {
                    path: 'reviews',
                    Component: UserReviews,
                  },
                ],
              },
            ],
          },
          {
            path: 'orders',
            children: [
              { index: true, Component: Orders },
              {
                path: ':orderNumber',
                Component: Order,
              },
            ],
          },
          {
            path: 'currencies',
            Component: Currencies,
          },
        ],
      },
    ],
  },
]);
