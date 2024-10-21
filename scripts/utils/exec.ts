// eslint-disable-next-line depend/ban-dependencies
import { type Options, type ResultPromise, execa } from 'execa';
import picocolors from 'picocolors';

const logger = console;

type StepOptions = {
  startMessage?: string;
  errorMessage?: string;
  dryRun?: boolean;
  debug?: boolean;
  cancelSignal?: AbortSignal;
};

export const exec = async (
  command: string | string[],
  options: Options = {},
  { startMessage, errorMessage, dryRun, debug, cancelSignal }: StepOptions = {},
): Promise<void> => {
  logger.info();

  if (startMessage) {
    logger.info(startMessage);
  }

  if (dryRun) {
    logger.info(`\n> ${command}\n`);
    return undefined;
  }

  const defaultOptions: Options = {
    shell: true,
    stdout: debug ? 'inherit' : 'pipe',
    stderr: debug ? 'inherit' : 'pipe',
    cancelSignal,
  };
  let currentChild: ResultPromise<Options>;

  try {
    if (typeof command === 'string') {
      logger.debug(`> ${command}`);
      currentChild = execa(command, { ...defaultOptions, ...options });
      await currentChild;
    } else {
      for (const subcommand of command) {
        logger.debug(`> ${subcommand}`);
        currentChild = execa(subcommand, { ...defaultOptions, ...options });
        await currentChild;
      }
    }
  } catch (err) {
    if (!(typeof err === 'object' && 'killed' in err! && err.killed)) {
      logger.error(
        picocolors.red(`An error occurred while executing: \`${command}\``),
      );
      logger.log(`${errorMessage}\n`);
    }

    throw err;
  }

  return undefined;
};
