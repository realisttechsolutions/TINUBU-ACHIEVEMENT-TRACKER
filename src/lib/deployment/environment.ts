export function isStagingEnvironment(
  environment: Record<string, string | undefined> = process.env,
): boolean {
  return environment.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase() === 'staging';
}
