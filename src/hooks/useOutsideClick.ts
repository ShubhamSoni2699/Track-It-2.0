import { useEffect, useRef } from 'react';

export function useOutsideClick(setShowModal) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          setShowModal(false);
        }
      }
      document.addEventListener('click', handleClick, true);
      return () => document.removeEventListener('click', handleClick, true);
    },
    [setShowModal]
  );
  return ref;
}
