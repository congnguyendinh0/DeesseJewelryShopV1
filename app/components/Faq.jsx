import React from 'react';
import classNames from 'classnames';
import * as Accordion from '@radix-ui/react-accordion';
import {ChevronDownIcon} from '@radix-ui/react-icons';

const AccordionDemo = () => (
  <Accordion.Root
    className="w-full my-12"
    type="single"
    defaultValue="item-1"
    collapsible
  >
    <AccordionItem value="item-1">
      <AccordionTrigger> Modular fine jewelry</AccordionTrigger>
      <AccordionContent>
        With our first release, we’ve built a clever, customizable jewelry line
        that morphs with you. A necklace becomes a pair of anklets; an earring
        turns into a ring. Crafted from the finest materials and precious
        stones, Bijoux’s contemporary fine jewelry can be modified to match your
        mood, no matter where you are.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="item-2">
      <AccordionTrigger>Our Philosophy</AccordionTrigger>
      <AccordionContent>
        Built on the idea that life is yours for the making, Bijoux is a modular
        fine jewelry brand that, in its modularity, empowers you to live exactly
        as you are in a world of limitless possibilities.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="item-3">
      <AccordionTrigger>Our values</AccordionTrigger>
      <AccordionContent>
        The world is our home and we are called to leave it better than we found
        it. Everything we do, from creating sustainable products to building
        communities, is based on that principle. When you buy Bijoux jewelry,
        you’re supporting our artists and helping them make their lives, and the
        lives of their families, better.
      </AccordionContent>
    </AccordionItem>
  </Accordion.Root>
);

const AccordionItem = React.forwardRef(
  ({children, className, ...props}, forwardedRef) => (
    <Accordion.Item
      className={classNames(
        'mt-px overflow-hidden first:mt-0 focus-within:relative focus-within:z-10',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  ),
);

const AccordionTrigger = React.forwardRef(
  ({children, className, ...props}, forwardedRef) => (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={classNames(
          'hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none outline-none',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon
          className=" ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  ),
);

const AccordionContent = React.forwardRef(
  ({children, className, ...props}, forwardedRef) => (
    <Accordion.Content
      className={classNames(
        'data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px] bg-white',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="py-[15px] px-5">{children}</div>
    </Accordion.Content>
  ),
);

export default AccordionDemo;
