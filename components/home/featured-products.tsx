"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { featuredProducts } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function FeaturedProducts() {
  return (
    <section id="colecao" className="relative py-24 lg:py-32 bg-cream-100">
      <div className="container-boutique">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-xl">
            <span className="eyebrow">Coleção em destaque</span>
            <h2 className="mt-6 font-serif text-display-lg text-ink-600 text-balance">
              As favoritas{" "}
              <span className="italic font-display text-bordeaux-500">
                das nossas mães
              </span>
            </h2>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-sm text-bordeaux-500 hover:text-bordeaux-600 transition-colors group self-start lg:self-end"
          >
            Ver toda a coleção
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.6} />
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, i) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: easeOut }}
              className="group"
            >
              <Link href={`#`} className="block">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-blush-50 shadow-soft">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                  {product.imageHover && (
                    <Image
                      src={product.imageHover}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  )}

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      tone={
                        product.badge === "Última peça"
                          ? "scarcity"
                          : product.availability === "ready"
                          ? "ready"
                          : "order"
                      }
                    >
                      {product.badge}
                    </Badge>
                  </div>

                  {/* Hover CTA */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out-expo">
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full bg-cream text-bordeaux-600 hover:bg-blush-100 shadow-soft-lg"
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </div>

                <div className="mt-5 px-1">
                  <p className="text-xs uppercase tracking-[0.14em] text-ink-400 mb-2">
                    {product.collection}
                  </p>
                  <h3 className="font-serif text-lg text-ink-600 leading-snug">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    {product.oldPrice && (
                      <span className="text-sm text-ink-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                    <span className="text-base text-bordeaux-500 font-medium">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
