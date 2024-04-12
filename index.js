import { getTockensByAuth } from "./features/auth.js";
import { loadingDecorate } from "./UI/loading.js";
import {
  intervalDealsTableUpdater,
  orderedDealsTableUpdater,
} from "./UI/deals-table.js";
import { onChangeTableHeap } from "./UI/deals-heap-size.js";
import { onChangePage } from "./UI/pagination.js";
import { asyncDebounce } from "./features/debounce.js";
import { zipedMultyWithLastResult } from "./features/observer.js";
import { onChangeSortLeadsTable } from "./UI/deals-table.js";
import { getIntervalLeads } from "./features/leads.js";

const authCode =
  "def50200b34f45ef5461ae3def0a11b9bbf1a15f2db7371bf64902227b70f19641784a2a7df2dc144f0dafd4e21c11413f311aaef1ce2e1be61c74e667325ce390701a7514b8ea1737216b39d37e3b863b17e416fc18c0732e89831a6adb6251bf83ee442d1e110e45598c8c1176f351742ff54e6973bafe397897158d7e1ae81df9c2023ebf7dac38a9ff66fcf1b3baa7faf87d84996e216993a7da9338f534a840ae78a549bf73b92d93410cf5be50de4e621e5d302a2242acc393c30f9b1c6d46dcc4a2bd428d24b7f3a3e8a89f9249892dbfaf4d0af543b0f1d49841e1351ca762fa4d85fdc2d450334fa6aa20ad914084c1f1e0fa9b0d02634653bad3e0bffd7b9f6d05923c76af2ce82b4a45193f72485d1e35b9b4945d6ee80b182fbb0c88884ab39009489566c6456c2ae4d8781d75f53422814ac55b439c34ac45420421f83bc7e4fc2a19e0e7501009fdeb77b2795a86f9c7ba2176afa5042bcb21f0d9839fea6eb51521bcabd86c69ec9e550b42180432620851bcae5b1d3f564064a1619189449329553517c51864d5fabbff61a50b68187674b3bdd6559386319efc429faa5e33a3d7ae5b53ba52955a3b5991b93228f34432ee716f1b3a40cc5c9d3dc03cb7d35afcee7083c65e0f743fa4356ce9458aac48c524d49934bc887644bb22e164fd";
const getTockens = loadingDecorate("deals", getTockensByAuth);

const tokens = await getTockens(authCode)
  .then((tokens) => console.log("succes get Tokens") || tokens)
  .catch((err) => {
    console.error("error get tokens \n" + err.message);
  });

const updateOrderedTable = orderedDealsTableUpdater(tokens.accessToken);

const updateTableWithLoading = asyncDebounce(
  loadingDecorate("deals", updateOrderedTable),
  2000
);

const [intervalUpdaterStart, intervalUpdaterAbout] = intervalDealsTableUpdater(
  tokens.accessToken
);
const intervalUpdaterStartLoading = loadingDecorate(
  "deals",
  intervalUpdaterStart
);
const [setPage, setHeap, setOrder] = zipedMultyWithLastResult(null, null, [])(
  ([_, prevHeap], [, heap], last) => {
    if (heap == "All" && prevHeap !== heap) {
      console.log("start Interval");
      return intervalUpdaterStartLoading();
    } else {
      console.log("dad");
      intervalUpdaterAbout();
    }

    return last;
  },
  async ([prevPage, prevHeap], [page, heap], last) => {
    if (heap == "All") return last;
    if (page === prevPage && heap === prevHeap) return last;
    return updateTableWithLoading(heap, page)
      .then((sortFn) => console.log("resolved") || sortFn)
      .catch((err) => {
        if (err === "abort") {
          console.log("aborted");
          return;
        }
        console.error(err);
      });
  },
  async (_, [, , order], last) => {
    const sortedFn = await last;

    if (sortedFn) {
      const [name, direct] = order;
      sortedFn(name, direct);
    }
    return sortedFn;
  }
);

onChangeTableHeap(setHeap);
onChangePage(setPage);
onChangeSortLeadsTable(setOrder);
