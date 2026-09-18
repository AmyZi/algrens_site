import Link from 'next/link';

/**
 * Reusable breadcrumb trail.
 */
export default function Breadcrumb({ items, className = '' }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Brödsmulor" className={className}>
      <ol className="breadcrumb">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={i}
              className={`breadcrumb-item${isLast ? ' active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast || !item.href ? (
                item.label
              ) : (
                <Link href={item.href} className="link-subtle">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}