import React, { useState } from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface CartPreviewProps {
  items?: CartItem[];
  onViewCart?: () => void;
  onCheckout?: () => void;
  onRemoveItem?: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

const CartPreview = ({
  items = [
    {
      id: "1",
      name: "Modern Desk Lamp",
      price: 49.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80",
      variant: "Black",
    },
    {
      id: "2",
      name: "Ergonomic Office Chair",
      price: 199.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=300&q=80",
      variant: "Gray",
    },
  ],
  onViewCart = () => {},
  onCheckout = () => {},
  onRemoveItem = () => {},
  onUpdateQuantity = () => {},
}: CartPreviewProps) => {
  const [open, setOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="relative bg-white">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative p-2 text-gray-700 hover:text-gray-900"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 p-0 text-xs rounded-full"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-4" sideOffset={8}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Your Cart ({totalItems})</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <>
              <div className="max-h-[300px] overflow-auto space-y-3 mb-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 py-2">
                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {item.name}
                      </h4>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.variant}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <DropdownMenuSeparator />

              <div className="py-3">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onViewCart();
                      setOpen(false);
                    }}
                  >
                    View Cart
                  </Button>
                  <Button
                    onClick={() => {
                      onCheckout();
                      setOpen(false);
                    }}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CartPreview;
