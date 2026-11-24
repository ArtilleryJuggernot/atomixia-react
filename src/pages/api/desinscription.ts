import type { APIRoute } from 'astro';
import { getOptout, postOptout } from '../../lib/optout';
import { site } from '../../lib/site';

export const prerender = false;

function addressOf(context: Parameters<APIRoute>[0]): string {
  try {
    return context.clientAddress;
  } catch {
    return '';
  }
}

export const POST: APIRoute = async (context) => postOptout(context.request, addressOf(context), site.email);

export const GET: APIRoute = async (context) => getOptout(context.request, addressOf(context));
