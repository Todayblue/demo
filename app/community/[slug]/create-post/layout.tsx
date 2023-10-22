import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getAuthSession();

  const subcommunity = await prisma.subCommunity.findFirst({
    where: { slug: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  if (!subcommunity) return notFound();

  const memberCount = await prisma.subscription.count({
    where: {
      subCommunity: {
        slug: slug,
      },
    },
  });

  return (
    <div className="h-screen  bg-gray-300">
      <div className="pt-16 mx-24">
        <div className="grid place-content-center lg:grid-cols-6  gap-6 md:grid-cols-1 ">
          {/* <ToFeedButton /> */}
          <div className="col-span-4">{children}</div>
          {/* info sidebar */}
          <div className="col-span-2 hidden lg:block  bg-white  rounded-lg  border border-gray-300  ">
            <div className="mx-6 pt-4 ">
              <p className="font-semibold py-3 border-b border-gray-300 ">
                About Community
              </p>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subcommunity?.createdAt?.toDateString()}>
                    {subcommunity?.createdAt
                      ? format(subcommunity.createdAt, "MMMM d, yyyy")
                      : "N/A"}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              {subcommunity.creatorId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">You created this community</dt>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}