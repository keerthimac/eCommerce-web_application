import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetails,
  stripeSession,
  getCheckoutDetails,
  payOrder,
} from "../features/orders/orderSlice";
import { reset } from "../features/orders/orderSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";

const OrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  let location = useLocation();
  const {
    order,
    sessionUrl,
    checkoutDetails,
    isLoading,
    isError,
    message,
    isSuccess,
  } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [sdkReady, setSdkReady] = useState(false);

  const checkoutId = location.search ? location.search.split("=")[1] : null;

  useEffect(() => {
    if (checkoutDetails && checkoutId) {
      if (checkoutDetails.session.payment_status === "paid") {
        console.log(
          checkoutDetails.session.id,
          checkoutDetails.session.payment_status,
          checkoutDetails.session.customer_details.email
        );
        let date = new Date(
          checkoutDetails.session.payment_intent.created * 1000
        );
        const details = {
          id: checkoutDetails.session.id,
          status: checkoutDetails.session.payment_status,
          update_time: date,
          email_address: checkoutDetails.session.customer_details.email,
        };
        dispatch(payOrder({ orderId: orderId, paymentResult: details }));
        console.log(orderId);
      }
    }
  }, [checkoutDetails]);

  useEffect(() => {
    if (checkoutId && order && !order.isPaid) {
      dispatch(
        getCheckoutDetails({ orderId: orderId, checkoutId: checkoutId })
      );
    }
  }, [dispatch, checkoutId, order]);

  useEffect(() => {
    if (sessionUrl) {
      window.location.assign(sessionUrl.url);
    }
  }, [dispatch, sessionUrl]);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
  }, [isSuccess]);

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }

  //   const addPayPalScript = async () => {
  //     const { data: clientId } = await axios.get("/api/config/paypal");
  //     const script = document.createElement("script");
  //     script.type = "text/javascript";
  //     script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
  //     script.async = true;
  //     script.onload = () => {
  //       setSdkReady(true);
  //     };
  //     document.body.appendChild(script);
  //   };

  //   if (!order || successPay || successDeliver || order._id !== orderId) {
  //     dispatch({ type: ORDER_PAY_RESET });
  //     dispatch({ type: ORDER_DELIVER_RESET });
  //     dispatch(getOrderDetails(orderId));
  //   } else if (!order.isPaid) {
  //     if (!window.paypal) {
  //       addPayPalScript();
  //     } else {
  //       setSdkReady(true);
  //     }
  //   }
  // }, [dispatch, orderId, successPay, successDeliver, order]);

  // const successPaymentHandler = (paymentResult) => {
  //   console.log(paymentResult);
  //   dispatch(payOrder(orderId, paymentResult));
  // };

  const onClickHandler = async () => {
    // Create the Stripe checkout session
    const body = order.orderItems.map((item) => ({
      id: item.product,
      quantity: item.qty,
      name: item.name,
      price: item.price,
    }));
    console.log(body);

    dispatch(stripeSession({ orderId: orderId, orderBody: body }));
  };

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{message}</Message>
  ) : order ? (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader /> 
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )} */}
              {!order.isPaid && (
                <ListGroup.Item>
                  <Button onClick={onClickHandler}>
                    Pay With {order.paymentMethod}
                  </Button>
                </ListGroup.Item>
              )}

              {/* {loadingDeliver && <Loader />} */}
              {user && user.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    // onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <Message variant="danger">Order not found</Message>
  );
};

export default OrderScreen;
