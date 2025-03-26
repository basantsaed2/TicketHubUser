import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProtectedLogin from "./ProtectedData/ProtectedRoute";
import LoginPage from "./Pages/Authentication/LoginPage";
import SignUpPage from "./Pages/Authentication/SignUpPage";
import { CheckoutPage, HomePage, SearchResultPage,ProfilePage, WalletPage, PointsPage ,MyTripsPage } from "./Pages/allPages";

export const router = createBrowserRouter(
  [
    {
      path: '',
      element: <App />,
      children: [
      // Authentication Routes
      {
        path: 'auth',
        element: <ProtectedLogin />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "sign_up",
            element: <SignUpPage />,
          },
        ],
      },

      {
        path: '/',
        element: <HomePage />,
      },
      {
        path:"search_result",
        element:<SearchResultPage/>
      },
      {
        path:"checkout",
        element:<CheckoutPage/>
      },
      {
        path:"profile",
        element:<ProfilePage/>
      },
      {
        path:"wallet",
        element:<WalletPage/>
      },
      {
        path:"points",
        element:<PointsPage/>
      },
      {
        path:"my_trips",
        element:<MyTripsPage/>
      }
      
      ],
    },
    // {
    //   path: '',
    //   element: <App />,
    //   children: [
    //     // Authentication
    //     {
    //       path: 'auth',
    //       element: <ProtectedLogin />,
    //       children: [{

    //         path: '',
    //         element: <AuthLayout />,
    //         children: [

    //           {
    //             path: 'login',
    //             element: <LoginPage />
    //           },
    //           {
    //             path: 'sign_up',
    //             element: <SignUpPage />
    //           },
    //         ],
    //       }
    //       ]
    //     },
    //     // {
    //     //   path: 'profile',
    //     //   // element: <ProfilePage />,
    //     //   element: <ProtectedLogin />,
    //     //   children: [
    //     //     {
    //     //       path: '',
    //     //       element: <ProfilePage />,

    //     //     }
    //     //   ]
    //     // },
    //   ],
    // },
    /* Catch-all for 404 */
    // {
    //   path: '*',
    //   element: <NotFoundPage />,
    // },
  ],
);
