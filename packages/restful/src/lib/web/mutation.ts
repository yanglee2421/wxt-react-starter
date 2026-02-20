export function mutation() {
  const observer = new MutationObserver((records, observer) => {
    observer.disconnect();

    const [record] = records;
    console.log(record);
  });

  // Bootstrap observe
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
  });

  // Handle any still-pending mutations
  const list = observer.takeRecords();
  void list;

  // Abort observe
  observer.disconnect();
}
