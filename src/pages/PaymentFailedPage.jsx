const PaymentFailedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-xl text-red-500 font-semibold">
        Payment Failed ❌
      </h1>
      <p>Please try again.</p>
    </div>
  );
};

export default PaymentFailedPage;