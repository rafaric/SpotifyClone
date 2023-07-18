"use client";

import { Price, ProductWithPrice } from "@/types";
import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import useSubscribeModal from "@/hooks/useSubscribeModal";

interface SubscribeModalProps {
  products: ProductWithPrice[];
}
const formatPrice = (price: Price) => {
  const princeString = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);
  return princeString;
};

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  let content = <div className="text-center">No hay productos disponibles</div>;

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Debes iniciar sesión para realizar esta acción");
    }
    if (subscription) {
      setPriceIdLoading(undefined);
      return toast.error("Ya tienes una suscripción activa");
    }
    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      toast.error((err as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };
  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return (
              <div key={product.id}>
                No hay precios disponibles para este producto.
              </div>
            );
          }
          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIdLoading}
              className="mb-4"
            >{`Subscribirse por ${formatPrice(price)} por ${
              price.interval
            }`}</Button>
          ));
        })}
      </div>
    );
  }
  if (subscription) {
    content = <div className="text-center">Ya estás subsripto</div>;
  }
  return (
    <Modal
      title="Solo usuarios registrados"
      description="Escucha la musica en Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
